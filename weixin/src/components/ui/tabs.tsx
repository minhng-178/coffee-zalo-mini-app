import { Tabs as NutTabs } from "@nutui/nutui-react-taro";
import {
  Children,
  FC,
  ReactElement,
  ReactNode,
  isValidElement,
  useEffect,
  useState,
} from "react";

// Matches zmp-ui's <Tabs defaultActiveKey className><Tabs.Tab key label>...
// call site (see pages/category.tsx). `Tabs.Tab` is a data-only marker
// component — it's never mounted directly, `Tabs` reads its `.props` off the
// React element and renders NutUI's TabPane instead.
export interface TabProps {
  label: ReactNode;
  children?: ReactNode;
}

const Tab: FC<TabProps> = ({ children }) => <>{children}</>;

export interface TabsProps {
  scrollable?: boolean;
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  className?: string;
  children?: ReactNode;
}

const TabsBase: FC<TabsProps> = ({
  defaultActiveKey,
  activeKey,
  onChange,
  className,
  children,
}) => {
  const tabElements = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[];
  const initial = activeKey ?? defaultActiveKey ?? String(tabElements[0]?.key ?? "");
  const [value, setValue] = useState<string>(initial);

  useEffect(() => {
    if (activeKey !== undefined) setValue(activeKey);
  }, [activeKey]);

  return (
    <NutTabs
      className={className}
      value={value}
      onChange={(next: any) => {
        const key = String(next);
        setValue(key);
        onChange?.(key);
      }}
    >
      {tabElements.map((tab) => (
        <NutTabs.TabPane key={String(tab.key)} title={tab.props.label as any} value={String(tab.key)}>
          {tab.props.children}
        </NutTabs.TabPane>
      ))}
    </NutTabs>
  );
};

export const Tabs = Object.assign(TabsBase, { Tab });
