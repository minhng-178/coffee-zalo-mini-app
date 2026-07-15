import React, { FC, ReactNode } from "react";
import { Box, Icon, Text } from "components/ui";

export interface ListItemProps {
  title: ReactNode;
  subtitle: ReactNode;
  onClick?: (event?: any) => void;
  className?: string;
}

export const ListItem: FC<ListItemProps> = ({
  title,
  subtitle,
  onClick,
  className = "",
}) => {
  return (
    <Box flex className={`space-x-2 ${className}`} onClick={onClick}>
      <Box className="flex-1 space-y-[2px]">
        <Text size="small" className="font-medium text-sm text-primary">
          {title}
        </Text>
        <Text size="xSmall" className="text-gray">
          {subtitle}
        </Text>
      </Box>
      <Icon icon="zi-chevron-right" />
    </Box>
  );
};
