import { View } from "@tarojs/components";
import { FC, ReactNode } from "react";

// Matches zmp-ui's <Spinner logo>. Only usage is components/payment-icon.tsx.
// A simple loading spinner needs no external lib.
export interface SpinnerProps {
  logo?: ReactNode;
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ logo, className = "" }) => (
  <View className={`relative inline-flex items-center justify-center w-16 h-16 ${className}`}>
    <View className="absolute inset-0 rounded-full border-4 border-divider border-t-primary animate-spin" />
    {logo && <View className="relative flex items-center justify-center">{logo}</View>}
  </View>
);
