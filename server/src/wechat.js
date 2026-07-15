const crypto = require("crypto");
const fs = require("fs");

// WeChat auth + WeChat Pay APIv3 signing helpers (mirrors mac.js's role for
// Zalo). All env vars are read lazily inside the functions below (not at
// module load) so a dev environment with no WeChat merchant account yet can
// still boot the server and serve the Zalo routes untouched — see index.js.
function getWechatConfig() {
  const {
    WECHAT_APPID,
    WECHAT_APP_SECRET,
    WECHAT_MCH_ID,
    WECHAT_MCH_PRIVATE_KEY,
    WECHAT_MCH_PRIVATE_KEY_PATH,
    WECHAT_MCH_CERT_SERIAL_NO,
    WECHAT_APIV3_KEY,
    WECHAT_PAY_NOTIFY_URL,
  } = process.env;

  // PEM string takes precedence over the file path, per spec.
  let mchPrivateKeyPem = WECHAT_MCH_PRIVATE_KEY || undefined;
  if (!mchPrivateKeyPem && WECHAT_MCH_PRIVATE_KEY_PATH) {
    try {
      mchPrivateKeyPem = fs.readFileSync(WECHAT_MCH_PRIVATE_KEY_PATH, "utf8");
    } catch {
      mchPrivateKeyPem = undefined;
    }
  }

  return {
    appId: WECHAT_APPID,
    appSecret: WECHAT_APP_SECRET,
    mchId: WECHAT_MCH_ID,
    mchPrivateKeyPem,
    mchCertSerialNo: WECHAT_MCH_CERT_SERIAL_NO,
    apiv3Key: WECHAT_APIV3_KEY,
    notifyUrl: WECHAT_PAY_NOTIFY_URL,
  };
}

function requireConfigKeys(config, keys) {
  const missing = keys.filter((key) => !config[key]);
  if (missing.length) {
    // Route handlers in index.js special-case this message to return 501
    // instead of crashing or 500ing — see index.js's wechat routes.
    throw new Error(`WeChat not configured: missing ${missing.join(", ")} (see .env.example)`);
  }
}

// Exchanges a wx.login() code for the user's openid (+ session_key, unionid).
// https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
async function code2Session(code) {
  const config = getWechatConfig();
  requireConfigKeys(config, ["appId", "appSecret"]);

  const url =
    `https://api.weixin.qq.com/sns/jscode2session?appid=${encodeURIComponent(config.appId)}` +
    `&secret=${encodeURIComponent(config.appSecret)}` +
    `&js_code=${encodeURIComponent(code)}` +
    `&grant_type=authorization_code`;

  const response = await fetch(url);
  const data = await response.json();
  if (data.errcode) {
    throw new Error(`WeChat code2Session failed: ${data.errcode} ${data.errmsg}`);
  }
  return data; // { openid, session_key, unionid? }
}

// Builds the second-round signature the mini program passes to
// Taro.requestPayment() / wx.requestPayment() to actually invoke JSAPI pay.
// https://pay.weixin.qq.com/doc/v3/merchant/4012062537
function buildJsapiPayParams({ prepayId, appId, mchPrivateKeyPem }) {
  const timeStamp = String(Math.floor(Date.now() / 1000));
  const nonceStr = crypto.randomBytes(16).toString("hex");
  const pkg = `prepay_id=${prepayId}`;
  const message = `${appId}\n${timeStamp}\n${nonceStr}\n${pkg}\n`;
  const paySign = crypto.sign("RSA-SHA256", Buffer.from(message), mchPrivateKeyPem).toString("base64");

  return { appId, timeStamp, nonceStr, package: pkg, signType: "RSA", paySign };
}

// Signs a WeChat Pay APIv3 request per their request-signing scheme.
// https://pay.weixin.qq.com/doc/v3/merchant/4012365340
function buildPayApiAuthorizationHeader({ method, url, body, mchId, mchCertSerialNo, mchPrivateKeyPem }) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonceStr = crypto.randomBytes(16).toString("hex");
  const message = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${body}\n`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(message), mchPrivateKeyPem).toString("base64");

  return (
    `WECHATPAY2-SHA256-RSA2048 mchid="${mchId}",nonce_str="${nonceStr}",` +
    `timestamp="${timestamp}",serial_no="${mchCertSerialNo}",signature="${signature}"`
  );
}

// Creates a JSAPI prepay order (WeChat Pay APIv3's "unified order" for
// mini programs) and returns the prepay_id to hand to buildJsapiPayParams().
// https://pay.weixin.qq.com/doc/v3/merchant/4012791861
async function createPrepayOrder({
  description,
  outTradeNo,
  totalFen,
  openid,
  notifyUrl,
  mchId,
  appId,
  mchPrivateKeyPem,
  mchCertSerialNo,
}) {
  requireConfigKeys(
    { mchId, appId, mchPrivateKeyPem, mchCertSerialNo, notifyUrl },
    ["mchId", "appId", "mchPrivateKeyPem", "mchCertSerialNo", "notifyUrl"]
  );

  const path = "/v3/pay/transactions/jsapi";
  const body = JSON.stringify({
    appid: appId,
    mchid: mchId,
    description,
    out_trade_no: outTradeNo,
    notify_url: notifyUrl,
    amount: { total: totalFen, currency: "CNY" },
    payer: { openid },
  });

  const authorization = buildPayApiAuthorizationHeader({
    method: "POST",
    url: path,
    body,
    mchId,
    mchCertSerialNo,
    mchPrivateKeyPem,
  });

  const response = await fetch(`https://api.mch.weixin.qq.com${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authorization,
    },
    body,
  });

  const data = await response.json();
  if (!response.ok || !data.prepay_id) {
    throw new Error(`WeChat Pay prepay order failed: ${response.status} ${JSON.stringify(data)}`);
  }
  return data.prepay_id;
}

// Decrypts the `resource` payload of a WeChat Pay APIv3 async notification
// (payment-callback). ciphertext is base64 with the GCM auth tag appended to
// the last 16 bytes. https://pay.weixin.qq.com/doc/v3/merchant/4012791874
function verifyAndDecryptNotify({ ciphertext, associatedData, nonce, apiv3Key }) {
  if (!apiv3Key) {
    throw new Error("WeChat not configured: missing apiv3Key (see .env.example)");
  }

  const raw = Buffer.from(ciphertext, "base64");
  const authTag = raw.subarray(raw.length - 16);
  const encrypted = raw.subarray(0, raw.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", apiv3Key, nonce);
  decipher.setAuthTag(authTag);
  if (associatedData) decipher.setAAD(Buffer.from(associatedData));

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8"));
}

module.exports = {
  getWechatConfig,
  code2Session,
  buildJsapiPayParams,
  createPrepayOrder,
  verifyAndDecryptNotify,
};
