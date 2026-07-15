# HDUI Coffee

<p style="display: flex; flex-wrap: wrap; gap: 4px">
  <img alt="react" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-coffee/react" />
  <img alt="zmp-ui" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-coffee/zmp-ui" />
  <img alt="zmp-sdk" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-coffee/zmp-sdk" />
  <img alt="recoil" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-coffee/recoil" />
  <img alt="tailwindcss" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-coffee/dev/tailwindcss" />
  <img alt="scss" src="https://img.shields.io/github/package-json/dependency-version/Zalo-MiniApp/zaui-coffee/dev/sass" />
</p>

Public template for building a coffee shop on Zalo Mini App. Main features:

- View coffee shop details and menus.
- Order coffee and snacks with customizable size options.
- Notifications management.
- Manage your cart and delivery options.
- View customer profile and membership.

|                      Demo                       |                  Entrypoint                  |
| :---------------------------------------------: | :------------------------------------------: |
| <img src="./docs/preview.webp" alt="Home page"> | <img src="./docs/qr.webp" alt="Entry point"> |

## Project structure

This repo has three parts:

- `client/` — the Zalo Mini App itself (Vite + React), see below for setup.
- `weixin/` — the WeChat Mini Program port of the same app (Taro + React), see `weixin/README.md` (if present) or the section below.
- `server/` — the shared Express backend, serving both the Zalo CheckoutSDK (COD) flow and WeChat Pay, see `server/README.md`.

Run `npm install` then `npm run dev` at the repo root to start the Zalo client + server concurrently. Run `npm run weixin` to build/watch the WeChat Mini Program separately (open `weixin/dist` in WeChat DevTools).

## Setup

### Using Zalo Mini App Extension

1. Install [Visual Studio Code](https://code.visualstudio.com/download) and [Zalo Mini App Extension](https://mini.zalo.me/docs/dev-tools).
1. Click on **Create Project** > Choose **HDUI Coffee** template > Wait until the generated project is ready.
1. **Configure App ID** and **Install Dependencies**, then navigate to the **Run** panel > **Start** to develop your Mini App 🚀


### Using Zalo Mini App Studio

1. [Install Zalo Mini App Studio](https://mini.zalo.me/docs/dev-tools)
1. Click on New project > Enter your Mini App ID > Choose HDUI Coffee template
1. Wait until the generated project is ready and click the Start button to run the mini app 🚀

### Using Zalo Mini App CLI

1. [Install Node JS](https://nodejs.org/en/download/)
1. [Install Mini App DevTools CLI](https://mini.zalo.me/docs/dev-tools/cli/intro/)
1. Download or clone this repository
1. Install dependencies

   ```bash
   cd client
   npm install
   ```

1. Start dev server using `zmp-cli`

   ```bash
   zmp start
   ```

1. Open `localhost:3000` on your browser and start coding 🔥

### WeChat Mini Program (weixin/)

1. [Install Node.js](https://nodejs.org/en/download/) and [WeChat DevTools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html).
1. Install dependencies and start the server (shared with the Zalo app):

   ```bash
   cd server
   npm install
   cp .env.example .env   # fill in DATABASE_URL at minimum; WECHAT_* vars can
                          # stay blank until you have a real WeChat Mini
                          # Program/merchant account — see server/README.md
   npm run seed
   npm run dev
   ```

1. Build/watch the WeChat client:

   ```bash
   cd weixin
   npm install
   cp .env.example .env   # API_BASE_URL, defaults to http://localhost:8080
   npm run dev:weapp
   ```

1. Open WeChat DevTools > Import Project > point it at `weixin/` (its `dist/`
   output, per `project.config.json`'s `miniprogramRoot`). The project ships
   with a placeholder `appid` ("touristappid") so it runs in the simulator
   without a registered Mini Program yet — swap in your real AppID in
   `weixin/project.config.json` once you have one.

Notes on what differs from the Zalo app: WeChat Pay, phone-number retrieval,
and the map/location pickers are implemented against WeChat's native APIs
(not Zalo's `zmp-sdk`) — see `server/README.md`'s WeChat section for the
payment/env-var setup, and `weixin/src/pages/cart/person-picker.tsx`'s TODO
comment for the one still-stubbed piece (phone-number decryption, pending a
server endpoint).

## Deployment

1. Create a mini app. For instruction on how to create a mini app, please refer to [Coffee Shop Tutorial](https://mini.zalo.me/tutorial/coffee-shop)

1. Setup payment methods if you want to accept online payments
   ![](./docs/payment.png "Payment method")

1. Deploy your mini app to Zalo using the mini app ID created in step 1.

   If you're using `zmp-cli`:

   ```bash
   zmp login
   zmp deploy
   ```

1. Scan the QR code using Zalo to preview your mini app.

## Usage:

The repository contains sample UI components for building your application. You may wish to integrate internal APIs to fetch restaurants, menus, and booking history or modify the code to suit your business needs.

Folder structure:

- **`src`**: Contains all the logic source code of your Mini App. Inside the `src` folder:

  - **`components`**: Reusable components written in React.JS.
  - **`css`**: Stylesheets; pre-processors are also supported.
  - **`pages`**: A Page is also a component but will act as an entire view and must be registered inside `app.tsx` as a [Route](https://mini.zalo.me/docs/zaui/router/ZMPRouter/).
  - **`statics`**: SVG and images that should be imported directly into bundle source code.
  - **`types`**: Contains TypeScript type and interface declarations.
  - **`utils`**: Reusable utility functions, such as distance calculation, date and time format, etc.
  - **`app.ts`**: Entry point of your Mini App.
  - **`global.d.ts`**: Contains TypeScript declarations for third-party modules and global objects.
  - **`state.ts`**: State management, containing [Recoil](https://recoiljs.org/docs/introduction/getting-started#atom)'s atoms and selectors.

- **`mock`**: Example data as \*.json files.

- **`app-config.json`**: [Global configuration](https://mini.zalo.me/intro/getting-started/app-config/) for your Mini App.

The other files (such as `tailwind.config.js`, `vite.config.ts`, `tsconfig.json`, `postcss.config.js`) are configurations for libraries used in your application. Visit the library's documentation to learn how to use them.

## Recipes

### Changing restaurant's name

Just change the `app.title` property in `app-config.json`:

```json
{
  "app": {
    "title": "HDUI Coffee"
  }
}
```

### Changing coffee shop's logo

Visit [Zalo Mini App](https://mini.zalo.me/) and go to your mini app's settings to change the logo.

### Customizations

You can customizations primary colors and currency displays using [Zalo Mini App Studio](https://mini.zalo.me/docs/dev-tools):

![Customizations](./docs/customizations.webp)

### Load product list from server

<img src="./docs/products-fetching.webp" alt="Products fetching" width="250" align="right">

For a simple MVP, you can put in your store products and categories as simply as making changes to `mock/*.json` files. However, a typical application would likely need to fetch data over REST API.

To make an HTTP GET request to your server and fetch the product list, update the `productsState` selector in src/state.ts to use `fetch`.

If the returned JSON structure is different from the template, you would need to map your product object to the corresponding `Product` interface. For example:

```ts
export const productsState = selector<Product[]>({
  key: "products",
  get: async () => {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    return data.products.map(
      ({ id, title, price, images, description, category }) =>
        <Product>{
          id,
          name: title,
          price: price,
          image: images[0],
          description,
          categoryId: category,
        }
    );
  },
});
```

Feel free to create another `service` layer and put the network fetching logics inside. This template provides only the UI layer, so you can customize the logic in any way you want.

## License

Copyright (c) Zalo Group. and its affiliates. All rights reserved.

The examples provided by Zalo Group are for non-commercial testing and evaluation
purposes only. Zalo Group reserves all rights not expressly granted.
# coffee-zalo-mini-app
