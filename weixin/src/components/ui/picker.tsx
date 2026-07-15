import { Picker as NutPicker } from "@nutui/nutui-react-taro";
import { View } from "@tarojs/components";
import { FC, useState } from "react";
import { Text } from "./box-text";

// Matches zmp-ui's <Picker> — the only call site is pages/cart/time-picker.tsx.
// zmp-ui's contract (see zmp-ui/picker/index.d.ts):
//  - `value`/`defaultValue` are plain values keyed by column name, e.g.
//    { date: 172..., time: 172... }
//  - `onChange` / `formatPickedValueDisplay` receive the *resolved option*
//    keyed by column name instead, e.g. { date: {displayName,value}, ... }
// This wraps NutUI's multi-column Picker (a controlled bottom-popup) and
// renders a tappable display field (the zmp-ui Picker renders its own input
// trigger inline) that opens it.
export type PickerOptionValue = string | number;

export interface PickerColumnOption {
  displayName: string;
  value: PickerOptionValue;
}

export interface PickerColumnData {
  options: PickerColumnOption[];
  name: string;
}

export type PickerResolvedValue = Record<string, PickerColumnOption>;

export interface PickerProps {
  mask?: boolean;
  maskClosable?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  inputClass?: string;
  placeholder?: string;
  title?: string;
  value?: Record<string, PickerOptionValue>;
  formatPickedValueDisplay?: (value: PickerResolvedValue) => string;
  onChange?: (value: PickerResolvedValue) => void;
  data: PickerColumnData[];
  className?: string;
}

export const Picker: FC<PickerProps> = ({
  maskClosable = true,
  onVisibilityChange,
  inputClass = "",
  placeholder = "",
  title,
  value,
  formatPickedValueDisplay,
  onChange,
  data,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  const resolved: PickerResolvedValue = {};
  data.forEach((column) => {
    const rawValue = value?.[column.name];
    const found = column.options.find((option) => option.value === rawValue);
    if (found) resolved[column.name] = found;
  });

  const nutOptions = data.map((column) =>
    column.options.map((option) => ({ label: String(option.displayName), value: option.value })),
  );
  const nutValue = data.map(
    (column) => resolved[column.name]?.value ?? column.options[0]?.value ?? null,
  );

  const open = () => {
    setVisible(true);
    onVisibilityChange?.(true);
  };
  const close = () => {
    setVisible(false);
    onVisibilityChange?.(false);
  };

  const hasFullSelection = data.every((column) => resolved[column.name] !== undefined);
  const displayText =
    hasFullSelection && formatPickedValueDisplay ? formatPickedValueDisplay(resolved) : placeholder;

  return (
    <>
      <View className={`${inputClass} ${className}`} onClick={open}>
        <Text>{displayText}</Text>
      </View>
      <NutPicker
        title={title}
        visible={visible}
        options={nutOptions}
        value={nutValue as any}
        popupProps={{ closeOnOverlayClick: maskClosable } as any}
        onClose={close}
        onCancel={close}
        onConfirm={(selectedOptions: any) => {
          const record: PickerResolvedValue = {};
          data.forEach((column, index) => {
            const option = selectedOptions[index];
            if (option) {
              record[column.name] = {
                displayName: String(option.label),
                value: option.value,
              };
            }
          });
          onChange?.(record);
          close();
        }}
      />
    </>
  );
};
