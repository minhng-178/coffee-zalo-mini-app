import { View, Text as TaroText } from "@tarojs/components";
import React, { CSSProperties, FC, PropsWithChildren, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Box — matches zmp-ui's <Box> spacing-shorthand API (m/p/mt/.../flex/...).
// zmp-ui's spacing levels are level * 4px (see zmp-ui/box/index.d.ts).
// ---------------------------------------------------------------------------

export interface BoxProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  m?: number;
  p?: number;
  mt?: number;
  ml?: number;
  mb?: number;
  mr?: number;
  pt?: number;
  pl?: number;
  pb?: number;
  pr?: number;
  mx?: number;
  my?: number;
  px?: number;
  py?: number;
  width?: number | string;
  height?: number | string;
  flex?: boolean;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  flexWrap?: boolean;
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "initial";
  alignItems?:
    | "flex-start"
    | "flex-end"
    | "stretch"
    | "baseline"
    | "center"
    | "initial";
  alignContent?:
    | "stretch"
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "initial";
  onClick?: (event: any) => void;
  children?: ReactNode;
  [key: string]: any;
}

const unit = (v?: number) => (v !== undefined ? v * 4 : undefined);

function spacingStyle({
  m,
  p,
  mt,
  ml,
  mb,
  mr,
  pt,
  pl,
  pb,
  pr,
  mx,
  my,
  px,
  py,
  width,
  height,
  flex,
  flexDirection,
  flexWrap,
  justifyContent,
  alignItems,
  alignContent,
}: BoxProps): CSSProperties {
  const style: CSSProperties = {};
  if (m !== undefined) style.margin = unit(m);
  if (p !== undefined) style.padding = unit(p);
  if (mx !== undefined) {
    style.marginLeft = unit(mx);
    style.marginRight = unit(mx);
  }
  if (my !== undefined) {
    style.marginTop = unit(my);
    style.marginBottom = unit(my);
  }
  if (px !== undefined) {
    style.paddingLeft = unit(px);
    style.paddingRight = unit(px);
  }
  if (py !== undefined) {
    style.paddingTop = unit(py);
    style.paddingBottom = unit(py);
  }
  if (mt !== undefined) style.marginTop = unit(mt);
  if (ml !== undefined) style.marginLeft = unit(ml);
  if (mb !== undefined) style.marginBottom = unit(mb);
  if (mr !== undefined) style.marginRight = unit(mr);
  if (pt !== undefined) style.paddingTop = unit(pt);
  if (pl !== undefined) style.paddingLeft = unit(pl);
  if (pb !== undefined) style.paddingBottom = unit(pb);
  if (pr !== undefined) style.paddingRight = unit(pr);
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;
  if (flex) style.display = "flex";
  if (flexDirection) style.flexDirection = flexDirection;
  if (flexWrap) style.flexWrap = "wrap";
  if (justifyContent) style.justifyContent = justifyContent;
  if (alignItems) style.alignItems = alignItems;
  if (alignContent) style.alignContent = alignContent;
  return style;
}

const LAYOUT_KEYS = [
  "m",
  "p",
  "mt",
  "ml",
  "mb",
  "mr",
  "pt",
  "pl",
  "pb",
  "pr",
  "mx",
  "my",
  "px",
  "py",
  "width",
  "height",
  "flex",
  "flexDirection",
  "flexWrap",
  "justifyContent",
  "alignItems",
  "alignContent",
] as const;

export const Box: FC<PropsWithChildren<BoxProps>> = ({
  id,
  className,
  style,
  children,
  ...rest
}) => {
  const layoutStyle = spacingStyle(rest);
  const domProps: Record<string, any> = {};
  Object.keys(rest).forEach((key) => {
    if (!(LAYOUT_KEYS as readonly string[]).includes(key)) {
      domProps[key] = rest[key];
    }
  });
  return (
    <View
      id={id}
      className={className}
      style={{ ...layoutStyle, ...style }}
      {...domProps}
    >
      {children}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Text / Text.Title / Text.Header — matches zmp-ui's Text compound component.
// Font sizes copied from zmp-ui/text/styles/text.css so the visual scale
// stays identical after the port.
// ---------------------------------------------------------------------------

export type BodyTextSize =
  | "xLarge"
  | "large"
  | "normal"
  | "small"
  | "xSmall"
  | "xxSmall"
  | "xxxSmall"
  | "xxxxSmall";

export type TitleTextSize = "xLarge" | "large" | "normal" | "small";

export type HeaderTextSize = "normal" | "small";

export interface BodyTextProps {
  size?: BodyTextSize;
  bold?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: (event: any) => void;
  [key: string]: any;
}

const BODY_SIZE: Record<BodyTextSize, CSSProperties> = {
  xLarge: { fontSize: 18, lineHeight: "24px" },
  large: { fontSize: 16, lineHeight: "22px" },
  normal: { fontSize: 15, lineHeight: "20px" },
  small: { fontSize: 14, lineHeight: "18px" },
  xSmall: { fontSize: 13, lineHeight: "18px" },
  xxSmall: { fontSize: 12, lineHeight: "16px" },
  xxxSmall: { fontSize: 11, lineHeight: "16px" },
  xxxxSmall: { fontSize: 10, lineHeight: "14px" },
};

const TITLE_SIZE: Record<TitleTextSize, CSSProperties> = {
  xLarge: { fontSize: 22, lineHeight: "26px" },
  large: { fontSize: 20, lineHeight: "26px" },
  normal: { fontSize: 18, lineHeight: "24px" },
  small: { fontSize: 15, lineHeight: "20px" },
};

const HEADER_SIZE: Record<HeaderTextSize, CSSProperties> = {
  normal: { fontSize: 16, lineHeight: "22px" },
  small: { fontSize: 15, lineHeight: "22px" },
};

const TextBase: FC<BodyTextProps> = ({
  size = "normal",
  bold,
  className,
  style,
  children,
  ...rest
}) => (
  <TaroText
    className={className}
    style={{
      display: "block",
      fontWeight: bold ? 500 : 400,
      ...BODY_SIZE[size],
      ...style,
    }}
    {...rest}
  >
    {children}
  </TaroText>
);

export interface TitleTextProps {
  size?: TitleTextSize;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: any;
}

const Title: FC<TitleTextProps> = ({
  size = "normal",
  className,
  style,
  children,
  ...rest
}) => (
  <TaroText
    className={className}
    style={{
      display: "block",
      fontWeight: 500,
      ...TITLE_SIZE[size],
      ...style,
    }}
    {...rest}
  >
    {children}
  </TaroText>
);

export interface HeaderTextProps {
  size?: HeaderTextSize;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: any;
}

const Header: FC<HeaderTextProps> = ({
  size = "normal",
  className,
  style,
  children,
  ...rest
}) => (
  <TaroText
    className={className}
    style={{
      display: "block",
      fontWeight: 500,
      ...HEADER_SIZE[size],
      ...style,
    }}
    {...rest}
  >
    {children}
  </TaroText>
);

export const Text = Object.assign(TextBase, { Title, Header });
