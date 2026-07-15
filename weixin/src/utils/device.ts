import Taro from "@tarojs/taro";

export function matchStatusBarColor(visible: boolean) {
  Taro.setNavigationBarColor({
    frontColor: visible ? "#ffffff" : "#000000",
    backgroundColor: "#ffffff",
  });
}
