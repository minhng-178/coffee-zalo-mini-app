# HDUI Coffee payment server

Backend for the Zalo Mini App CheckoutSDK "Cash on Delivery" flow. Holds the
app's Private Key server-side and exposes the endpoints the mini app and
Zalo's own servers call during checkout.

## Setup

```
cd server
cp .env.example .env   # fill in ZALO_APP_ID and ZALO_PRIVATE_KEY from the
                        # app's dashboard (Security Method / Private Key)
npm install
npm run dev
```

## Endpoints

- `POST /orders` — called by the mini app before `createOrder()`. Body:
  `{ item, amount, desc, extradata }`. Returns `{ orderId, mac }`.
- `POST /zalo/order-callback` — deploy this and paste the public URL into
  **both** the "Callback URL" and "Sandbox Callback URL" fields in the app's
  dashboard, then flip `App Status` to `ACTIVE` once you're ready to test.
  Zalo's servers call this, unauthenticated, to verify each order before
  letting the user finish COD checkout.

Orders are stored in-memory (`src/orderStore.js`) — swap this for a real
database before relying on this in production.
