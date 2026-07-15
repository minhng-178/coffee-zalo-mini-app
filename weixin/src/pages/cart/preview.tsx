import Taro from "@tarojs/taro";
import { DisplayPrice } from "components/display/price";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import {
  cartState,
  deliveryAddressState,
  orderNoteState,
  selectedStoreState,
  totalPriceState,
  totalQuantityState,
} from "state";
import payWeChat from "utils/product";
import { Box, Button, Text } from "components/ui";

export const CartPreview: FC = () => {
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const cart = useRecoilValue(cartState);
  const note = useRecoilValue(orderNoteState);
  const deliveryAddress = useRecoilValue(deliveryAddressState);
  const selectedStore = useRecoilValue(selectedStoreState);

  const checkout = () => {
    payWeChat(cart, {
      note,
      deliveryAddress,
      storeId: selectedStore?.id,
    })
      .then(() => Taro.navigateTo({ url: "/pages/result?status=success" }))
      .catch(() => Taro.navigateTo({ url: "/pages/result?status=fail" }));
  };

  return (
    <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
      <Box
        flex
        flexDirection="column"
        justifyContent="space-between"
        className="min-w-[120px] flex-none"
      >
        <Text className="text-gray" size="xSmall">
          {quantity} sản phẩm
        </Text>
        <Text.Title size="large">
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>
      <Button type="highlight" disabled={!quantity} fullWidth onClick={checkout}>
        Đặt hàng
      </Button>
    </Box>
  );
};
