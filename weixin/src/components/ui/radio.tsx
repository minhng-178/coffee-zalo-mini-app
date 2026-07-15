import { RadioGroup as NutRadioGroup } from "@nutui/nutui-react-taro";
import { CSSProperties, FC, ReactNode } from "react";

// Matches zmp-ui's <Radio.Group options value onChange> call sites (see
// components/product/single-option-picker.tsx, pages/cart/delivery.tsx).
// NutUI's RadioGroup already accepts an `options: {label,value,disabled}[]`
// array and drives selection the same way, so this is a thin passthrough.
export interface RadioOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface RadioGroupProps {
  className?: string;
  style?: CSSProperties;
  name?: string;
  options: RadioOption[];
  value?: string | number;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const Group: FC<RadioGroupProps> = ({
  className,
  style,
  options,
  value,
  disabled,
  onChange,
}) => (
  <NutRadioGroup
    className={className}
    style={style}
    shape="button"
    disabled={disabled}
    value={value as any}
    options={options as any}
    onChange={(next: any) => onChange?.(next)}
  />
);

export const Radio = { Group };
