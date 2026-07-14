require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const { computeOrderMac, computeCallbackMac } = require("./mac");
const { createOrder, getOrder, setOrderStatus } = require("./orderStore");
const { connectDb, getDb } = require("./db");

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

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Payment server listening on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
