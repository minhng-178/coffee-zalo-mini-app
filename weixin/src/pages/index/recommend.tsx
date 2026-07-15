import { FinalPrice } from "components/display/final-price";
import { DisplayPrice } from "components/display/price";
import { ProductPicker } from "components/product/picker";
import { Section } from "components/section";
import { ProductSlideSkeleton } from "components/skeletons";
import React, { Suspense, FC } from "react";
import { View } from "@tarojs/components";
import { useRecoilValue } from "recoil";
import { recommendProductsState } from "state";
import { Swiper, SwiperItem } from "@tarojs/components";
import { Box, Text } from "components/ui";

export const RecommendContent: FC = () => {
  const recommendProducts = useRecoilValue(recommendProductsState);

  return (
    <Section title="Gợi ý cho bạn" padding="title-only">
      {/* Taro's Swiper has no slidesPerView prop for a "peek next slide"
          effect — approximated with previousMargin/nextMargin instead. */}
      <Swiper previousMargin="48px" nextMargin="48px" className="w-full h-[220px]">
        {recommendProducts.map((product) => (
          <SwiperItem key={product.id}>
            <ProductPicker product={product}>
              {({ open }) => (
                <View onClick={open} className="space-y-3 px-2">
                  <Box
                    className="relative aspect-video rounded-lg bg-cover bg-center bg-skeleton"
                    style={{ backgroundImage: `url(${product.image})` }}
                  >
                    {product.sale && (
                      <Text
                        size="xxxxSmall"
                        className="absolute right-2 top-2 uppercase bg-green text-white h-4 px-[6px] rounded-full"
                      >
                        Giảm{" "}
                        {product.sale.type === "percent" ? (
                          `${product.sale.percent * 100}%`
                        ) : (
                          <DisplayPrice>{product.sale.amount}</DisplayPrice>
                        )}
                      </Text>
                    )}
                  </Box>
                  <Box className="space-y-1">
                    <Text size="small">{product.name}</Text>
                    <Text size="xxSmall" className="line-through text-gray">
                      <DisplayPrice>{product.price}</DisplayPrice>
                    </Text>
                    <Text size="large" className="font-medium text-primary">
                      <FinalPrice>{product}</FinalPrice>
                    </Text>
                  </Box>
                </View>
              )}
            </ProductPicker>
          </SwiperItem>
        ))}
      </Swiper>
    </Section>
  );
};

export const RecommendFallback: FC = () => {
  const recommendProducts = [...new Array(3)];

  return (
    <Section title="Gợi ý cho bạn" padding="title-only">
      <Swiper previousMargin="48px" nextMargin="48px" className="w-full h-[220px]">
        {recommendProducts.map((_, i) => (
          <SwiperItem key={i}>
            <View className="px-2">
              <ProductSlideSkeleton />
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </Section>
  );
};

export const Recommend: FC = () => {
  return (
    <Suspense fallback={<RecommendFallback />}>
      <RecommendContent />
    </Suspense>
  );
};
