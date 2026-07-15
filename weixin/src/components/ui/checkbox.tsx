import { CheckboxGroup as NutCheckboxGroup } from "@nutui/nutui-react-taro";
import { CSSProperties, FC, ReactNode } from "react";

// Matches zmp-ui's <Checkbox.Group options value defaultValue onChange> call
// site (see components/product/multiple-option-picker.tsx). NutUI's
// CheckboxGroup already accepts an `options: {label,value,disabled}[]` array
// and drives selection the same way, so this is a thin passthrough.
export interface CheckboxOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface CheckboxGroupProps {
  className?: string;
  style?: CSSProperties;
  name?: string;
  options: CheckboxOption[];
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  disabled?: boolean;
  onChange?: (value: string[]) => void;
}

const Group: FC<CheckboxGroupProps> = ({
  className,
  style,
  options,
  value,
  defaultValue,
  disabled,
  onChange,
}) => (
  <NutCheckboxGroup
    className={className}
    style={style}
    disabled={disabled}
    value={value as any}
    defaultValue={defaultValue as any}
    options={options as any}
    onChange={(next: any) => onChange?.(next)}
  />
);

export const Checkbox = { Group };
