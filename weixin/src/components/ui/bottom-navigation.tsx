import { View } from "@tarojs/components";
import {
  Children,
  FC,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { Text } from "./box-text";

// Matches zmp-ui's <BottomNavigation activeKey onChange><BottomNavigation.Item
// key label icon activeIcon /></BottomNavigation> call site (see
// components/navigation.tsx). Presentational only for now — it is not wired
// to WeChat's native tabBar or real page navigation, that's a later phase's
// job once all pages are registered in app.config.ts.
export interface BottomNavigationItemProps {
  label: ReactNode;
  icon?: ReactNode;
  activeIcon?: ReactNode;
  className?: string;
}

interface InternalItemProps extends BottomNavigationItemProps {
  active?: boolean;
  onItemClick?: () => void;
}

const Item: FC<InternalItemProps> = ({ label, icon, activeIcon, className = "", active, onItemClick }) => (
  <View
    className={`flex-1 flex flex-col items-center justify-center py-1 ${className}`}
    onClick={onItemClick}
  >
    <View className="text-xl leading-none">{active && activeIcon ? activeIcon : icon}</View>
    <Text size="xxSmall" className={active ? "text-primary" : "text-gray"}>
      {label}
    </Text>
  </View>
);

export interface BottomNavigationProps {
  id?: string;
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  className?: string;
  children?: ReactNode;
}

const BottomNavigationBase: FC<BottomNavigationProps> = ({
  id,
  activeKey,
  onChange,
  className = "",
  children,
}) => {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<BottomNavigationItemProps>[];

  return (
    <View id={id} className={`flex border-t border-divider bg-white ${className}`}>
      {items.map((child) => {
        const key = child.key != null ? String(child.key) : undefined;
        return cloneElement(child, {
          active: key !== undefined && key === activeKey,
          onItemClick: () => key !== undefined && onChange?.(key),
        } as Partial<InternalItemProps>);
      })}
    </View>
  );
};

export const BottomNavigation = Object.assign(BottomNavigationBase, { Item });
