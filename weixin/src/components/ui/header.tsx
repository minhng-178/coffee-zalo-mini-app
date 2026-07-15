import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { CSSProperties, FC, ReactNode } from "react";
import { Icon } from "./icon";
import { Text } from "./box-text";

// Matches zmp-ui's <Header>, which is an in-content header bar (not the OS
// nav bar). WeChat's real system nav bar title is set separately per-page via
// definePageConfig({ navigationBarTitleText }) — that's a later phase's job.
export interface HeaderProps {
  title?: ReactNode;
  showBackIcon?: boolean;
  backIcon?: ReactNode;
  onBackClick?: (event?: any) => void;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export const Header: FC<HeaderProps> = ({
  title,
  showBackIcon = true,
  backIcon,
  onBackClick,
  backgroundColor,
  textColor,
  className = "",
  style,
  id,
}) => {
  const handleBackClick = (event?: any) => {
    if (onBackClick) {
      onBackClick(event);
      return;
    }
    Taro.navigateBack().catch(() => {
      // no page to go back to (e.g. entry page) — nothing to do
    });
  };

  return (
    <View
      id={id}
      className={`flex items-center h-11 px-4 flex-none ${className}`}
      style={{
        backgroundColor: backgroundColor ?? "#ffffff",
        color: textColor,
        ...style,
      }}
    >
      {showBackIcon && (
        <View className="mr-2 flex items-center justify-center" onClick={handleBackClick}>
          {backIcon ?? (
            <Icon icon="zi-chevron-right" size={20} style={{ transform: "rotate(180deg)" }} />
          )}
        </View>
      )}
      <Text
        className="flex-1 font-medium overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ textAlign: showBackIcon ? "left" : "center" }}
        size="large"
      >
        {title}
      </Text>
    </View>
  );
};
