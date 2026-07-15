import React, { FC } from "react";
import { Swiper, SwiperItem } from "@tarojs/components";
import { getDummyImage } from "utils/product";
import { Box } from "components/ui";

export const Banner: FC = () => {
  return (
    <Box className="bg-white" pb={4}>
      {/* Taro's native Swiper needs an explicit pixel/CSS height (it doesn't
          auto-size to content like a plain View) — approximated here with
          the same aspect-[2/1] ratio the original slide content used. */}
      <Swiper autoplay circular indicatorDots className="w-full aspect-[2/1]">
        {[1, 2, 3, 4, 5]
          .map((i) => getDummyImage(`banner-${i}.webp`))
          .map((banner, i) => (
            <SwiperItem key={i} className="px-4">
              <Box
                className="w-full h-full rounded-lg bg-cover bg-center bg-skeleton"
                style={{ backgroundImage: `url(${banner})` }}
              />
            </SwiperItem>
          ))}
      </Swiper>
    </Box>
  );
};
