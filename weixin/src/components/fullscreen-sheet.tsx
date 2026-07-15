import { useMatchStatusTextColor } from "hooks";
import React, { FC } from "react";
import {
  ActionSheetProps,
  Sheet as OriginalSheet,
  SheetProps,
} from "components/ui";

export const Sheet: FC<SheetProps> = (props) => {
  useMatchStatusTextColor(props.visible);
  return <OriginalSheet {...props} />;
};

export const ActionSheet: FC<ActionSheetProps> = (props) => {
  useMatchStatusTextColor(props.visible);
  return <OriginalSheet.Actions {...props} />;
};
