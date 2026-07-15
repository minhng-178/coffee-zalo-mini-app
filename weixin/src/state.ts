import { atom, selector, selectorFamily } from "recoil";
import Taro from "@tarojs/taro";
import logo from "static/logo.png";
import { Category } from "types/category";
import { Product } from "types/product";
import { Cart } from "types/cart";
import { Notification } from "types/notification";
import { calculateDistance, fetchLocationOnce } from "utils/location";
import { FulfillmentType, Store } from "types/delivery";
import { calcFinalPrice } from "utils/product";
import { wait } from "utils/async";
import { request } from "utils/request";

export const userState = selector({
  key: "user",
  get: async () => {
    const { code } = await Taro.login();
    try {
      // openid/session are resolved server-side (server/src/wechat.js) so the
      // app secret never reaches the client.
      return await request<{ openId: string }>(`${API_BASE_URL}/wechat/login`, {
        method: "POST",
        data: { code },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  },
});

export const categoriesState = selector<Category[]>({
  key: "categories",
  get: async () => {
    return request<Category[]>(`${API_BASE_URL}/categories`);
  },
});

export const productsState = selector<Product[]>({
  key: "products",
  get: async () => {
    return request<Product[]>(`${API_BASE_URL}/products`);
  },
});

export const recommendProductsState = selector<Product[]>({
  key: "recommendProducts",
  get: ({ get }) => {
    const products = get(productsState);
    return products.filter((p) => p.sale);
  },
});

export const selectedCategoryIdState = atom({
  key: "selectedCategoryId",
  default: "coffee",
});

export const productsByCategoryState = selectorFamily<Product[], string>({
  key: "productsByCategory",
  get:
    (categoryId) =>
    ({ get }) => {
      const allProducts = get(productsState);
      return allProducts.filter((product) =>
        product.categoryId.includes(categoryId)
      );
    },
});

export const cartState = atom<Cart>({
  key: "cart",
  default: [],
});

export const totalQuantityState = selector({
  key: "totalQuantity",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
});

export const totalPriceState = selector({
  key: "totalPrice",
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce(
      (total, item) =>
        total + item.quantity * calcFinalPrice(item.product, item.options),
      0
    );
  },
});

export const notificationsState = atom<Notification[]>({
  key: "notifications",
  default: [
    {
      id: 1,
      image: logo,
      title: "Chào bạn mới",
      content:
        "Cảm ơn đã sử dụng HDUI Coffee, bạn có thể dùng ứng dụng này để tiết kiệm thời gian xây dựng",
    },
    {
      id: 2,
      image: logo,
      title: "Giảm 50% lần đầu mua hàng",
      content: "Nhập WELCOME để được giảm 50% giá trị đơn hàng đầu tiên order",
    },
  ],
});

export const keywordState = atom({
  key: "keyword",
  default: "",
});

export const resultState = selector<Product[]>({
  key: "result",
  get: async ({ get }) => {
    const keyword = get(keywordState);
    if (!keyword.trim()) {
      return [];
    }
    const products = get(productsState);
    await wait(500);
    return products.filter((product) =>
      product.name.trim().toLowerCase().includes(keyword.trim().toLowerCase())
    );
  },
});

export const storesState = atom<Store[]>({
  key: "stores",
  default: [
    {
      id: 1,
      name: "HDUI Coffee - Thép Mới",
      address:
        "15 Thép Mới, Phường Bảy Hiền, Quận Tân Bình, Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.7970481,
      long: 106.647743,
    },
    {
      id: 2,
      name: "HDUI Coffee - Chi nhánh 2",
      address: "Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.762622,
      long: 106.660172,
    },
    {
      id: 3,
      name: "HDUI Coffee - Chi nhánh 3",
      address: "Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.823099,
      long: 106.629662,
    },
    {
      id: 4,
      name: "HDUI Coffee - Chi nhánh 4",
      address: "Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.732599,
      long: 106.719971,
    },
    {
      id: 5,
      name: "HDUI Coffee - Chi nhánh 5",
      address: "Thành phố Hồ Chí Minh, Việt Nam",
      lat: 10.796654,
      long: 106.700035,
    },
  ],
});

export const nearbyStoresState = selector({
  key: "nearbyStores",
  get: ({ get }) => {
    // Get the current location from the locationState atom
    const location = get(locationState);

    // Get the list of stores from the storesState atom
    const stores = get(storesState);

    // Calculate the distance of each store from the current location
    if (location) {
      const storesWithDistance = stores.map((store) => ({
        ...store,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          store.lat,
          store.long
        ),
      }));

      // Sort the stores by distance from the current location
      const nearbyStores = storesWithDistance.sort(
        (a, b) => a.distance - b.distance
      );

      return nearbyStores;
    }
    return stores;
  },
});

export const selectedStoreIndexState = atom({
  key: "selectedStoreIndex",
  default: 0,
});

export const selectedStoreState = selector({
  key: "selectedStore",
  get: ({ get }) => {
    const index = get(selectedStoreIndexState);
    const stores = get(nearbyStoresState);
    return stores[index];
  },
});

export const selectedDeliveryTimeState = atom({
  key: "selectedDeliveryTime",
  default: +new Date(),
});

export const requestLocationTriesState = atom({
  key: "requestLocationTries",
  default: 0,
});

export const locationState = selector<
  { latitude: string; longitude: string } | false
>({
  key: "location",
  get: async ({ get }) => {
    const requested = get(requestLocationTriesState);
    return requested ? fetchLocationOnce() : false;
  },
});

// WeChat only exposes the user's phone number through a tap on a
// <Button openType="getPhoneNumber"> element (its onGetPhoneNumber callback
// yields an encrypted code that the server decrypts) — there's no
// zmp-sdk-style function to call imperatively, so unlike locationState this
// is a plain atom the button's callback writes into directly.
export const phoneState = atom<string | false>({
  key: "phone",
  default: false,
});

export const orderNoteState = atom({
  key: "orderNote",
  default: "",
});

export const fulfillmentTypeState = atom<FulfillmentType>({
  key: "fulfillmentType",
  default: "pickup",
});

export const deliveryAddressState = atom({
  key: "deliveryAddress",
  default: "",
});
