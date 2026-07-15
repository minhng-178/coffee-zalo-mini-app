import { Popup, ActionSheet as NutActionSheet } from "@nutui/nutui-react-taro";
import { CSSProperties, FC, ReactNode } from "react";

// Matches zmp-ui's <Sheet visible onClose title autoHeight unmountOnClose
// height> (see components/fullscreen-sheet.tsx, pages/cart/store-picker.tsx,
// pages/cart/delivery-address-picker.tsx, components/product/picker.tsx),
// built on NutUI's bottom Popup.
export interface SheetProps {
  visible?: boolean;
  onClose?: (event?: any) => void;
  title?: string;
  autoHeight?: boolean;
  unmountOnClose?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const SheetBase: FC<SheetProps> = ({
  visible,
  onClose,
  title,
  autoHeight,
  unmountOnClose,
  mask = true,
  maskClosable = true,
  height,
  className,
  style,
  children,
}) => (
  <Popup
    visible={!!visible}
    position="bottom"
    round
    title={title}
    overlay={mask}
    closeOnOverlayClick={maskClosable}
    destroyOnClose={unmountOnClose}
    onClose={() => onClose?.()}
    onOverlayClick={() => onClose?.()}
    className={className}
    style={{ height: autoHeight ? "auto" : height ?? "70%", ...style }}
  >
    {children}
  </Popup>
);

// Matches zmp-ui's <Sheet.Actions visible actions onClose onCancel onSelect>.
// Unused anywhere in client/src today (components/fullscreen-sheet.tsx just
// defines a passthrough wrapper around it), so this stays a thin wrapper
// around NutUI's ActionSheet rather than a deep reimplementation.
export interface ActionSheetOption {
  text: string;
  onClick?: (event?: any) => void;
  disabled?: boolean;
  danger?: boolean;
  className?: string;
}

export interface ActionSheetProps {
  visible?: boolean;
  onClose?: (event?: any) => void;
  actions?: ActionSheetOption[] | ActionSheetOption[][];
  title?: string;
  className?: string;
}

const Actions: FC<ActionSheetProps> = ({ visible, onClose, actions, title, className }) => {
  const flatActions = (actions ?? []).flat();
  return (
    <NutActionSheet
      visible={!!visible}
      title={title}
      className={className}
      description={title}
      options={flatActions.map((action) => ({
        name: action.text,
        disable: !!action.disabled,
        danger: !!action.danger,
      }))}
      onSelect={(_option: any, index: number) => {
        flatActions[index]?.onClick?.();
        onClose?.();
      }}
      onCancel={() => onClose?.()}
    />
  );
};

export const Sheet = Object.assign(SheetBase, { Actions });
