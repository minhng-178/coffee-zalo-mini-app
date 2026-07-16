import { View } from "@tarojs/components";
import { CSSProperties, FC, PropsWithChildren } from "react";

// Matches zmp-ui's <Page> full-page flex container.
export interface PageProps {
  className?: string;
  style?: CSSProperties;
}

export const Page: FC<PropsWithChildren<PageProps>> = ({
  className = "",
  style,
  children,
}) => (
  <View className={`h-screen flex flex-col bg-white ${className}`} style={style}>
    {children}
  </View>
);
