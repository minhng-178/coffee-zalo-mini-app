const CryptoJS = require("crypto-js");

// Zalo Mini App CheckoutSDK order mac: sort the order body's keys, join as
// `key=value` (objects JSON-stringified) with "&", then HMAC-SHA256 it with
// the app's Private Key. Must run server-side only.
function computeOrderMac(body, privateKey) {
  const dataString = Object.keys(body)
    .sort()
    .map((key) => {
      const value = body[key];
      return `${key}=${typeof value === "object" ? JSON.stringify(value) : value}`;
    })
    .join("&");
  return CryptoJS.HmacSHA256(dataString, privateKey).toString();
}

// Zalo's order-callback mac: fixed-order `appId=...&orderId=...&method=...`,
// HMAC-SHA256 with the same Private Key.
function computeCallbackMac({ appId, orderId, method }, privateKey) {
  const dataString = `appId=${appId}&orderId=${orderId}&method=${method}`;
  return CryptoJS.HmacSHA256(dataString, privateKey).toString();
}

module.exports = { computeOrderMac, computeCallbackMac };
