"use client";

import { useCallback, useEffect, useState, type SyntheticEvent } from "react";
import { Select, type SelectProps } from "@mui/material";

export type GuideSelectProps = SelectProps;

function mergeMenuProps(menuProps?: SelectProps["MenuProps"]) {
  return {
    disableScrollLock: true,
    ...menuProps,
  };
}

export default function GuideSelect({
  MenuProps,
  open: openProp,
  onOpen,
  onClose,
  ...rest
}: GuideSelectProps) {
  const isOpenControlled = openProp !== undefined;
  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const open = isOpenControlled ? openProp : openUncontrolled;

  const closeMenu = useCallback(
    (event: SyntheticEvent) => {
      if (!isOpenControlled) {
        setOpenUncontrolled(false);
      }
      onClose?.(event);
    },
    [isOpenControlled, onClose],
  );

  const handleOpen = useCallback(
    (event: SyntheticEvent) => {
      if (!isOpenControlled) {
        setOpenUncontrolled(true);
      }
      onOpen?.(event);
    },
    [isOpenControlled, onOpen],
  );

  const handleClose = useCallback(
    (event: SyntheticEvent) => {
      if (!isOpenControlled) {
        setOpenUncontrolled(false);
      }
      onClose?.(event);
    },
    [isOpenControlled, onClose],
  );

  useEffect(() => {
    if (!open) return;

    const handleScroll = () => {
      closeMenu({} as SyntheticEvent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [closeMenu, open]);

  return (
    <Select
      {...rest}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      MenuProps={mergeMenuProps(MenuProps)}
    />
  );
}
