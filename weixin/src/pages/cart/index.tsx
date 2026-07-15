import React, { FC, Suspense } from "react";
import { Divider } from "components/divider";
import { Header, Page } from "components/ui";
import { CartItems } from "./cart-items";
import { CartPreview } from "./preview";
import { TermsAndPolicies } from "./term-and-policies";
import { Delivery } from "./delivery";
import { useVirtualKeyboardVisible } from "hooks";
import { AppBottomNav } from "components/bottom-nav";

const CartPage: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();

  return (
    <Page className="flex flex-col">
      <Header title="Giỏ hàng" showBackIcon={false} />
      <CartItems />
      <Delivery />
      <Divider size={12} />
      <TermsAndPolicies />
      <Divider size={32} className="flex-1" />
      {!keyboardVisible && (
        <Suspense fallback={null}>
          <CartPreview />
        </Suspense>
      )}
      <AppBottomNav activeKey="/cart" />
    </Page>
  );
};

export default CartPage;
