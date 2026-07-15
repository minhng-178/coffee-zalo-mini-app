import { View } from "@tarojs/components";
import { CSSProperties, FC, ReactNode } from "react";

// Matches zmp-ui's <Button variant type fullWidth disabled onClick suffixIcon
// prefixIcon icon>. Built on a plain View (not Taro's native <Button>) so we
// have full control over styling without fighting the mini-program's default
// button chrome — no call site currently needs native button features like
// open-type, so this stays a simple tappable View.
export interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary";
  type?: "highlight" | "danger" | "neutral";
  size?: "large" | "medium" | "small";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: (event?: any) => void;
  children?: ReactNode;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  icon?: ReactNode;
  id?: string;
}

const COLOR_CLASSES: Record<string, string> = {
  "primary-highlight": "bg-primary text-white",
  "primary-danger": "bg-red-500 text-white",
  "primary-neutral": "bg-[#e9ebed] text-black",
  "secondary-highlight": "bg-[#d6e9ff] text-primary",
  "secondary-danger": "bg-[#fed8d7] text-red-500",
  "secondary-neutral": "bg-[#e9ebed] text-black",
  "tertiary-highlight": "bg-transparent text-primary",
  "tertiary-danger": "bg-transparent text-red-500",
  "tertiary-neutral": "bg-transparent text-black",
};

const SIZE_CLASSES: Record<string, string> = {
  large: "h-12 text-base px-5",
  medium: "h-10 text-sm px-4",
  small: "h-8 text-sm px-3",
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  type = "highlight",
  size = "medium",
  fullWidth,
  disabled,
  loading,
  className = "",
  style,
  onClick,
  children,
  prefixIcon,
  suffixIcon,
  icon,
  id,
}) => {
  const colorClasses =
    COLOR_CLASSES[`${variant}-${type}`] ?? COLOR_CLASSES["primary-highlight"];
  const sizeClasses = SIZE_CLASSES[size] ?? SIZE_CLASSES.medium;

  return (
    <View
      id={id}
      className={`inline-flex items-center justify-center gap-1 rounded-lg font-medium ${sizeClasses} ${colorClasses} ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-40" : ""} ${className}`}
      style={style}
      onClick={disabled ? undefined : onClick}
    >
      {(prefixIcon ?? icon) && (
        <View className="flex items-center justify-center">{prefixIcon ?? icon}</View>
      )}
      {loading ? "..." : children}
      {suffixIcon && <View className="flex items-center justify-center">{suffixIcon}</View>}
    </View>
  );
};
