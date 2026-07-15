import React, { FC } from "react";
import { Box, BoxProps } from "components/ui";

export const Divider: FC<{ size?: number; className?: string } & BoxProps> = ({
  size = 8,
  ...props
}) => {
  return (
    <Box
      style={{
        minHeight: size,
        backgroundColor: "#f4f5f6",
      }}
      {...props}
    />
  );
};
