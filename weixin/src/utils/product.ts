import Taro from "@tarojs/taro";
import { Option, Product } from "types/product";
import { getConfig } from "./config";
import { Cart, SelectedOptions } from "types/cart";
import { request } from "./request";

export function calcFinalPrice(product: Product, options?: SelectedOptions) {
  let finalPrice = product.price;
  if (product.sale) {
    if (product.sale.type === "fixed") {
      finalPrice = product.price - product.sale.amount;
    } else {
      finalPrice = product.price * (1 - product.sale.percent);
    }
  }

  if (options && product.variants) {
    const selectedOptions: Option[] = [];
    for (const variantKey in options) {
      const variant = product.variants.find((v) => v.id === variantKey);
      if (variant) {
        const currentOption = options[variantKey];
        if (typeof currentOption === "string") {
          const selected = variant.options.find((o) => o.id === currentOption);
          if (selected) {
            selectedOptions.push(selected);
          }
        } else {
          const selecteds = variant.options.filter((o) =>
            currentOption.includes(o.id),
          );
          selectedOptions.push(...selecteds);
        }
      }
    }
    finalPrice = selectedOptions.reduce((price, option) => {
      if (option.priceChange) {
        if (option.priceChange.type == "fixed") {
          return price + option.priceChange.amount;
        } else {
          return price + product.price * option.priceChange.percent;
        }
      }
      return price;
    }, finalPrice);
  }
  return finalPrice;
}

export function getDummyImage(filename: string) {
  return `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/${filename}`;
}

export function isIdentical(
  option1: SelectedOptions,
  option2: SelectedOptions,
) {
  const option1Keys = Object.keys(option1);
  const option2Keys = Object.keys(option2);

  if (option1Keys.length !== option2Keys.length) {
    return false;
  }

  for (const key of option1Keys) {
    const option1Value = option1[key];
    const option2Value = option2[key];

    const areEqual =
      Array.isArray(option1Value) &&
      Array.isArray(option2Value) &&
      [...option1Value].sort().toString() ===
        [...option2Value].sort().toString();

    if (option1Value !== option2Value && !areEqual) {
      return false;
    }
  }

  return true;
}

export interface PayWeChatOptions {
  note?: string;
  deliveryAddress?: string;
  storeId?: number;
  description?: string;
}

interface WeChatOrderResponse {
  orderId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: "MD5" | "HMAC-SHA256";
  paySign: string;
}

// Checkout via WeChat Pay JSAPI. The unified-order request and signing
// happen server-side (server/src/wechatPay.js) — this client never sees the
// merchant API key. See server/README.md for the payment-callback flow.
const payWeChat = async (cart: Cart, opts: PayWeChatOptions = {}) => {
  const item = cart.map((cartItem) => ({
    id: String(cartItem.product.id),
    amount:
      cartItem.quantity * calcFinalPrice(cartItem.product, cartItem.options),
  }));
  const amount = item.reduce((total, i) => total + i.amount, 0);
  const desc =
    opts.description ??
    `Thanh toán cho ${getConfig((config) => config.app.title)}`;

  const { code } = await Taro.login();

  const order = await request<WeChatOrderResponse>(
    `${API_BASE_URL}/wechat/orders`,
    {
      method: "POST",
      data: {
        code,
        item,
        amount,
        desc,
        extradata: {
          note: opts.note,
          deliveryAddress: opts.deliveryAddress,
          storeId: opts.storeId,
        },
      },
    },
  );

  return Taro.requestPayment({
    timeStamp: order.timeStamp,
    nonceStr: order.nonceStr,
    package: order.package,
    signType: order.signType,
    paySign: order.paySign,
  });
};

export default payWeChat;
