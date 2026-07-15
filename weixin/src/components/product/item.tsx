import { FinalPrice } from "components/display/final-price";
import React, { FC } from "react";
import { Image, View } from "@tarojs/components";
import { Product } from "types/product";
import { Box, Text } from "components/ui";
import { ProductPicker } from "./picker";

export const ProductItem: FC<{ product: Product }> = ({ product }) => {
  return (
    <ProductPicker product={product}>
      {({ open }) => (
        <View className="space-y-2" onClick={open}>
          <Box className="w-full aspect-square relative">
            <Image
              lazyLoad
              mode="aspectFill"
              src={product.image}
              className="absolute left-0 right-0 top-0 bottom-0 w-full h-full rounded-lg bg-skeleton"
            />
          </Box>
          <Text>{product.name}</Text>
          <Text size="xxSmall" className="text-gray pb-2">
            <FinalPrice>{product}</FinalPrice>
          </Text>
        </View>
      )}
    </ProductPicker>
  );
};
