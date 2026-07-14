import { atom, selector, selectorFamily } from "recoil";
import { getPhoneNumber, getUserInfo } from "zmp-sdk";
import logo from "static/logo.png";
import { Category } from "types/category";
import { Product, Variant } from "types/product";
import { Cart } from "types/cart";
import { Notification } from "types/notification";
import { calculateDistance, fetchLocationOnce } from "utils/location";
import { FulfillmentType, Store } from "types/delivery";
import { calcFinalPrice } from "utils/product";
import { wait } from "utils/async";
import categories from "../mock/categories.json";

export const userState = selector({
  key: "user",
  get: async () => {
    const { userInfo } = await getUserInfo({ autoRequestPermission: true });
    return userInfo;
  },
});

export const categoriesState = selector<Category[]>({
  key: "categories",
  get: () => categories,
});

export const productsState = selector<Product[]>({
  key: "products",
  get: async () => {
    await wait(2000);
    const products = (await import("../mock/products.json")).default;
    const variants = (await import("../mock/variants.json"))
      .default as Variant[];
    return products.map(
      (product) =>
        ({
          ...product,
          variants: variants.filter((variant) =>
            product.variantId.includes(variant.id)
          ),
        } as Product)
    );
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

// Bounding box roughly covering inner Ho Chi Minh City districts.
const HCM_BOUNDS = { latMin: 10.7, latMax: 10.85, longMin: 106.6, longMax: 106.8 };

const randomCoordInHCM = () => ({
  lat: HCM_BOUNDS.latMin + Math.random() * (HCM_BOUNDS.latMax - HCM_BOUNDS.latMin),
  long: HCM_BOUNDS.longMin + Math.random() * (HCM_BOUNDS.longMax - HCM_BOUNDS.longMin),
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
      ...randomCoordInHCM(),
    },
    {
      id: 3,
      name: "HDUI Coffee - Chi nhánh 3",
      address: "Thành phố Hồ Chí Minh, Việt Nam",
      ...randomCoordInHCM(),
    },
    {
      id: 4,
      name: "HDUI Coffee - Chi nhánh 4",
      address: "Thành phố Hồ Chí Minh, Việt Nam",
      ...randomCoordInHCM(),
    },
    {
      id: 5,
      name: "HDUI Coffee - Chi nhánh 5",
      address: "Thành phố Hồ Chí Minh, Việt Nam",
      ...randomCoordInHCM(),
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
    return [];
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

export const requestPhoneTriesState = atom({
  key: "requestPhoneTries",
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

export const phoneState = selector<string | boolean>({
  key: "phone",
  get: async ({ get }) => {
    const requested = get(requestPhoneTriesState);
    if (requested) {
      try {
        const { number, token } = await getPhoneNumber({ fail: console.warn });
        if (number) {
          return number;
        }
        console.warn(
          "Sử dụng token này để truy xuất số điện thoại của người dùng",
          token
        );
        console.warn(
          "Chi tiết tham khảo: ",
          "https://mini.zalo.me/blog/thong-bao-thay-doi-luong-truy-xuat-thong-tin-nguoi-dung-tren-zalo-mini-app"
        );
        console.warn("Giả lập số điện thoại mặc định: 0337076898");
        return "0337076898";
      } catch (error) {
        // Xử lý exception
        console.error(error);
        return false;
      }
    }

    return false;
  },
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
