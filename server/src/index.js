require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const { computeOrderMac, computeCallbackMac } = require("./mac");
const { createOrder, getOrder, setOrderStatus } = require("./orderStore");
const { connectDb, getDb } = require("./db");
const {
  getWechatConfig,
  code2Session,
  buildJsapiPayParams,
  createPrepayOrder,
  verifyAndDecryptNotify,
} = require("./wechat");
const wechatSessionStore = require("./wechatSessionStore");

const { ZALO_APP_ID, ZALO_PRIVATE_KEY, PORT = 8080, CORS_ORIGIN } = process.env;

if (!ZALO_APP_ID || !ZALO_PRIVATE_KEY) {
  throw new Error("ZALO_APP_ID and ZALO_PRIVATE_KEY must be set (see .env.example)");
}

// Zalo's callback servers as of this writing — logged, not enforced, since
// Zalo may add/rotate IPs; the mac check below is the real authentication.
const ZALO_CALLBACK_IPS = new Set(["118.102.2.29", "49.213.78.2"]);

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN ? CORS_ORIGIN.split(",") : true }));

// Catalog data (seeded via `npm run seed`, see src/seed.js) — read-only,
// served straight from MongoDB so the mini app doesn't bundle it.
app.get("/categories", async (req, res) => {
  const categories = await getDb().collection("categories").find({}, { projection: { _id: 0 } }).toArray();
  res.json(categories);
});

app.get("/products", async (req, res) => {
  const db = getDb();
  const [products, variants] = await Promise.all([
    db.collection("products").find({}, { projection: { _id: 0 } }).toArray(),
    db.collection("variants").find({}, { projection: { _id: 0 } }).toArray(),
  ]);
  res.json(
    products.map((product) => ({
      ...product,
      variants: variants.filter((variant) => product.variantId.includes(variant.id)),
    }))
  );
});

// 1. Mini app calls this right before createOrder() with the real cart.
// Returns the orderId + mac the client must attach to the createOrder call.
app.post("/orders", (req, res) => {
  const { item, amount, desc, extradata } = req.body || {};
  if (!Array.isArray(item) || typeof amount !== "number" || !desc) {
    return res.status(400).json({ error: "Missing item, amount, or desc" });
  }

  const orderId = uuid();
  // orderId must be part of the signed extradata, since it's the same
  // extradata object the mini app then attaches to createOrder().
  const fullExtradata = { ...extradata, orderId };
  const method = { id: "COD_SANDBOX", isCustom: false };
  const orderBody = { desc, item, amount, extradata: fullExtradata, method };
  createOrder(orderId, orderBody);

  const mac = computeOrderMac(orderBody, ZALO_PRIVATE_KEY);

  res.json({ orderId, mac, extradata: fullExtradata, method });
});

// 2. Zalo's servers call this (unauthenticated, no session) to verify an
// order before letting the user complete COD checkout in the mini app.
// Register this same URL as both "Callback URL" and "Sandbox Callback URL".
app.post("/zalo/order-callback", (req, res) => {
  const remoteIp = req.ip?.replace(/^::ffff:/, "");
  if (remoteIp && !ZALO_CALLBACK_IPS.has(remoteIp)) {
    console.warn(`order-callback hit from unexpected IP: ${remoteIp}`);
  }

  const { data, mac } = req.body || {};
  if (!data || !mac) {
    return res.json({ returnCode: 0, returnMessage: "Missing data or mac" });
  }

  const { appId, orderId, method } = data;
  if (!appId || !orderId || !method) {
    return res.json({ returnCode: 0, returnMessage: "Missing method or orderId or appId" });
  }

  if (appId !== ZALO_APP_ID) {
    return res.json({ returnCode: 0, returnMessage: "Unknown appId" });
  }

  const expectedMac = computeCallbackMac({ appId, orderId, method }, ZALO_PRIVATE_KEY);
  if (mac !== expectedMac) {
    return res.json({ returnCode: 0, returnMessage: "Invalid mac" });
  }

  const order = getOrder(orderId);
  if (!order) {
    return res.json({ returnCode: 0, returnMessage: "Order not found" });
  }

  setOrderStatus(orderId, "confirmed");
  res.json({ returnCode: 1, returnMessage: "Success" });
});

// --- WeChat Mini Program (weixin/) routes — additive, parallel to the Zalo
// flow above. WeChat env vars are optional at boot (read lazily in
// src/wechat.js); if they're unset these respond 501 instead of crashing.
function isWechatNotConfigured(err) {
  return typeof err?.message === "string" && err.message.startsWith("WeChat not configured");
}

// wx.login() code -> openid. session_key is cached server-side only, never
// returned to the client.
app.post("/wechat/login", async (req, res) => {
  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    const session = await code2Session(code);
    wechatSessionStore.setSession(session.openid, session.session_key);
    res.json({ openId: session.openid });
  } catch (err) {
    if (isWechatNotConfigured(err)) {
      return res.status(501).json({ error: "WeChat login not configured" });
    }
    console.error("wechat/login error:", err);
    res.status(500).json({ error: "Failed to log in with WeChat" });
  }
});

// Mirrors POST /orders above but for WeChat Pay JSAPI: exchanges the login
// code for an openid, creates a prepay order, and returns the client-side
// invocation signature Taro.requestPayment()/wx.requestPayment() needs.
app.post("/wechat/orders", async (req, res) => {
  const { code, item, amount, desc, extradata } = req.body || {};
  if (!code || !Array.isArray(item) || typeof amount !== "number" || !desc) {
    return res.status(400).json({ error: "Missing code, item, amount, or desc" });
  }

  try {
    const session = await code2Session(code);
    wechatSessionStore.setSession(session.openid, session.session_key);

    const orderId = uuid();
    const fullExtradata = { ...extradata, orderId };
    createOrder(orderId, { desc, item, amount, extradata: fullExtradata, platform: "wechat", openid: session.openid });

    const config = getWechatConfig();

    // NOTE (currency-unit placeholder): `amount` arrives in the same whole
    // currency units the shop's prices are modeled in today (VND-like, same
    // as Zalo's /orders — see client/src/utils/product.ts's payCOD and
    // weixin/src/utils/product.ts's payWeChat, both compute amount as
    // `quantity * calcFinalPrice(...)` with no unit conversion). WeChat Pay's
    // `amount.total` wants the smallest currency unit (fen for CNY). Until
    // the catalog is actually priced in CNY, we just multiply by 100 here —
    // revisit this conversion before taking real payments.
    const totalFen = Math.round(amount * 100);

    const prepayId = await createPrepayOrder({
      description: desc,
      outTradeNo: orderId,
      totalFen,
      openid: session.openid,
      notifyUrl: config.notifyUrl,
      mchId: config.mchId,
      appId: config.appId,
      mchPrivateKeyPem: config.mchPrivateKeyPem,
      mchCertSerialNo: config.mchCertSerialNo,
    });

    const payParams = buildJsapiPayParams({
      prepayId,
      appId: config.appId,
      mchPrivateKeyPem: config.mchPrivateKeyPem,
    });

    res.json({ orderId, ...payParams });
  } catch (err) {
    if (isWechatNotConfigured(err)) {
      return res.status(501).json({ error: "WeChat Pay not configured" });
    }
    console.error("wechat/orders error:", err);
    res.status(500).json({ error: "Failed to create WeChat order" });
  }
});

// WeChat Pay's async merchant notify URL (register in the merchant platform
// as WECHAT_PAY_NOTIFY_URL). Unauthenticated transport — the APIv3 payload
// itself is what's verified, via AES-256-GCM decryption with the API v3 key.
app.post("/wechat/payment-callback", async (req, res) => {
  try {
    const config = getWechatConfig();
    const { resource } = req.body || {};
    if (!resource) {
      throw new Error("Missing resource in notification");
    }

    const decrypted = verifyAndDecryptNotify({
      ciphertext: resource.ciphertext,
      associatedData: resource.associated_data,
      nonce: resource.nonce,
      apiv3Key: config.apiv3Key,
    });

    const { out_trade_no: orderId, trade_state } = decrypted;
    if (orderId && trade_state === "SUCCESS") {
      setOrderStatus(orderId, "confirmed");
    }

    res.json({ code: "SUCCESS", message: "成功" });
  } catch (err) {
    console.error("wechat/payment-callback error:", err);
    res.status(500).json({ code: "FAIL", message: err.message || "Failed to process notification" });
  }
});

connectDb()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Payment server listening on :${PORT}`);
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Another instance of this server is probably still running — ` +
            `find it with \`lsof -nP -iTCP:${PORT} -sTCP:LISTEN\` and stop it, or set PORT to a free port in .env.`
        );
        process.exit(1);
      }
      throw err;
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
