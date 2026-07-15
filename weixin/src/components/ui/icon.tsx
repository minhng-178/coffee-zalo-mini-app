import { View } from "@tarojs/components";
import {
  Add,
  ArrowDown,
  ArrowRight,
  Clock,
  ClockF,
  Edit,
  Home,
  Location,
  Message,
  Minus,
  Phone,
  Plus,
  Star,
  User,
} from "@nutui/icons-react-taro";
import { CSSProperties, FC } from "react";

// Maps zmp-ui's Zalo "zi-*" icon font (which has no WeChat equivalent) onto
// the closest matching @nutui/icons-react-taro icon. Only icons actually
// referenced somewhere in client/src are mapped here — see report for the
// full grep. Two are approximations with no perfect NutUI match:
//  - zi-notif -> Message (no bell/notification icon ships with the package)
//  - zi-note  -> Edit (no note-taking icon ships with the package)
const ICON_MAP: Record<string, FC<any>> = {
  "zi-plus-circle": Add,
  "zi-minus-circle": Minus,
  "zi-location": Location,
  "zi-chevron-right": ArrowRight,
  "zi-chevron-down": ArrowDown,
  "zi-home": Home,
  "zi-notif": Message,
  "zi-user": User,
  "zi-plus": Plus,
  "zi-clock-2": Clock,
  "zi-clock-1": ClockF,
  "zi-star": Star,
  "zi-call": Phone,
  "zi-note": Edit,
};

export interface IconProps {
  icon?: string;
  className?: string;
  style?: CSSProperties;
  size?: number;
  id?: string;
}

export const Icon: FC<IconProps> = ({ icon, className, style, size = 24, id }) => {
  const Component = icon ? ICON_MAP[icon] : undefined;

  if (!Component) {
    // Fallback for any zi-* name not in the map above: a plain sized box so
    // layout doesn't break, instead of forcing a bad icon match.
    return (
      <View
        id={id}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          fontSize: Math.round(size * 0.6),
          color: "#767a7f",
          ...style,
        }}
      >
        {"•"}
      </View>
    );
  }

  return <Component className={className} style={style} size={size} />;
};
