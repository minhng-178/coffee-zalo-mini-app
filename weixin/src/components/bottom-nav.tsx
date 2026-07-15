import Taro from "@tarojs/taro";
import React, { FC } from "react";
import { BottomNavigation, Icon } from "components/ui";
import { CartIcon } from "components/cart-icon";
import { useVirtualKeyboardVisible } from "hooks";
import { ROUTE_MAP } from "utils/navigation";

// Fresh replacement for client/src/components/navigation.tsx. The original
// was a persistent bottom bar shared by react-router's <Routes> tree, doing
// an instant in-SPA tab swap. Taro's page model has no shared outer
// shell/nested-routing concept — every registered page is its own
// independent render root — so this component is rendered standalone at the
// bottom of each of the 4 root pages' JSX instead, and switching tabs does a
// full page transition (Taro.reLaunch) rather than an in-place swap. This is
// an accepted, inherent simplification of the port.
export type BottomNavKey = "/" | "/notification" | "/cart" | "/profile";

export interface AppBottomNavProps {
  activeKey: BottomNavKey;
}

export const AppBottomNav: FC<AppBottomNavProps> = ({ activeKey }) => {
  const keyboardVisible = useVirtualKeyboardVisible();

  if (keyboardVisible) {
    return null;
  }

  const handleChange = (key: string) => {
    if (key === activeKey) return;
    const url = ROUTE_MAP[key];
    if (url) {
      Taro.reLaunch({ url }).catch(() => {});
    }
  };

  return (
    <BottomNavigation id="footer" activeKey={activeKey} onChange={handleChange} className="z-50">
      <BottomNavigation.Item key="/" label="Trang chủ" icon={<Icon icon="zi-home" />} />
      <BottomNavigation.Item key="/notification" label="Thông báo" icon={<Icon icon="zi-notif" />} />
      <BottomNavigation.Item
        key="/cart"
        label="Giỏ hàng"
        icon={<CartIcon />}
        activeIcon={<CartIcon active />}
      />
      <BottomNavigation.Item key="/profile" label="Cá nhân" icon={<Icon icon="zi-user" />} />
    </BottomNavigation>
  );
};
