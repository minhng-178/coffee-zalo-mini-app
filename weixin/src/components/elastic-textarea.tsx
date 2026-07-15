import { Textarea } from "@tarojs/components";
import { CSSProperties, FC } from "react";

// Matches client/src/components/elastic-textarea.tsx's call sites (see
// pages/cart/delivery.tsx). The original manually measured DOM
// scrollHeight/getComputedStyle to grow a <textarea> up to `maxRows`. Taro's
// native Textarea already grows itself via the built-in `autoHeight` prop, so
// there's no need to reproduce that measurement — `maxRows` is approximated
// with a CSS max-height (rows * ~20px line-height) + overflow-y auto instead
// of the original's precise scrollHeight math.
export interface ElasticTextareaProps {
  value?: string;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  maxRows?: number;
  onChange?: (event: { currentTarget: { value: string } }) => void;
}

const LINE_HEIGHT_PX = 20;

export const ElasticTextarea: FC<ElasticTextareaProps> = ({
  value,
  placeholder,
  className,
  style,
  maxRows,
  onChange,
}) => {
  const maxHeight = maxRows ? maxRows * LINE_HEIGHT_PX : undefined;

  return (
    <Textarea
      className={className}
      value={value}
      placeholder={placeholder}
      autoHeight
      style={{
        width: "100%",
        ...(maxHeight ? { maxHeight, overflowY: "auto" } : {}),
        ...style,
      }}
      onInput={(event) => {
        const nextValue = (event as any)?.detail?.value ?? "";
        onChange?.({ currentTarget: { value: nextValue } });
      }}
    />
  );
};
