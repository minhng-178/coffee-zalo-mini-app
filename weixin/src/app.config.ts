export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/category",
    "pages/search/index",
    "pages/cart/index",
    "pages/profile",
    "pages/notification",
    "pages/result",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "HDUI Coffee",
    navigationBarTextStyle: "black",
  },
  permission: {
    "scope.userLocation": {
      desc: "Dùng để tìm cửa hàng và địa chỉ giao hàng gần bạn",
    },
  },
  requiredPrivateInfos: ["getLocation"],
});
