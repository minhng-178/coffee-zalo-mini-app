# HDUI Coffee payment server

Backend for the Zalo Mini App CheckoutSDK "Cash on Delivery" flow. Holds the
app's Private Key server-side and exposes the endpoints the mini app and
Zalo's own servers call during checkout.

## Setup

```
cd server
cp .env.example .env   # fill in ZALO_APP_ID, ZALO_PRIVATE_KEY (from the
                        # app's dashboard) and DATABASE_URL (a MongoDB
                        # connection string)
npm install
npm run seed           # populate categories/products/variants collections
npm run dev
```

## Endpoints

- `GET /categories` — the product category list.
- `GET /products` — the product catalog, each item with its matching
  `variants` attached. Both are read from MongoDB and seeded via
  `npm run seed` (`src/seed.js`, source data in `src/seedData.js`).
- `POST /orders` — called by the mini app before `createOrder()`. Body:
  `{ item, amount, desc, extradata }`. Returns `{ orderId, mac }`.
- `POST /zalo/order-callback` — deploy this and paste the public URL into
  **both** the "Callback URL" and "Sandbox Callback URL" fields in the app's
  dashboard, then flip `App Status` to `ACTIVE` once you're ready to test.
  Zalo's servers call this, unauthenticated, to verify each order before
  letting the user finish COD checkout.

Orders are stored in-memory (`src/orderStore.js`) — swap this for a real
database before relying on this in production.

## WeChat Mini Program (weixin/)

Additive endpoints serving the Taro-based WeChat Mini Program client, alongside
(not instead of) the Zalo flow above. They share the same in-memory
`src/orderStore.js`, tagging orders with `platform: "wechat"`. WeChat auth +
WeChat Pay APIv3 signing live in `src/wechat.js` (the WeChat counterpart to
`src/mac.js`).

- `POST /wechat/login` — body `{ code }` (from `Taro.login()`). Exchanges the
  code for an openid via WeChat's `jscode2session` and returns `{ openId }`.
  `session_key` is cached server-side only (`src/wechatSessionStore.js`) and
  never sent to the client.
- `POST /wechat/orders` — body `{ code, item, amount, desc, extradata }` (same
  shape as `/orders`). Logs the user in, creates the order, requests a WeChat
  Pay JSAPI prepay order, and returns
  `{ orderId, timeStamp, nonceStr, package, signType, paySign }` — pass these
  straight to `Taro.requestPayment()`. Note: `amount` is currently in the same
  whole-currency-unit as Zalo's `/orders` (the catalog isn't priced in CNY
  yet); this endpoint multiplies by 100 as a placeholder to get WeChat Pay's
  required smallest-unit (`fen`) — revisit before accepting real payments.
- `POST /wechat/payment-callback` — WeChat Pay's async merchant notify URL
  (register the deployed URL as `WECHAT_PAY_NOTIFY_URL`). Decrypts the APIv3
  notification resource and, on `trade_state === "SUCCESS"`, marks the order
  confirmed. Responds per WeChat's ack contract: `200 {code:"SUCCESS", ...}`
  or `500 {code:"FAIL", ...}`.

Env vars (all optional — see `.env.example`): `WECHAT_APPID`,
`WECHAT_APP_SECRET`, `WECHAT_MCH_ID`, `WECHAT_MCH_PRIVATE_KEY` (or
`WECHAT_MCH_PRIVATE_KEY_PATH`), `WECHAT_MCH_CERT_SERIAL_NO`,
`WECHAT_APIV3_KEY`, `WECHAT_PAY_NOTIFY_URL`. Until real WeChat merchant
credentials are supplied, `/wechat/login` and `/wechat/orders` respond
`501 { error: ... }` rather than crashing the server or affecting the Zalo
routes above.
