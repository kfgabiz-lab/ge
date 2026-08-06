"use client";

import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import {
  GuideCheckboxIcon,
  guideCheckboxIconsDefault,
} from "@/components/form/GuideFieldIcons";
import { mainImagePopupContent } from "@/data/main/mainImagePopupContent";
import { getWindowScrollY, lockPageScroll, unlockPageScroll } from "@/lib/lenisScroll";
import { useModalFocusTrap } from "@/lib/useModalFocusTrap";

type MainImagePopupProps = {
  open?: boolean;
  onClose?: () => void;
  /** Section guide preview — in-flow, no fixed overlay / auto-open */
  embedded?: boolean;
};

const emptySubscribe = () => () => undefined;

/** Figma 8086:102342 — Main image popup */
export default function MainImagePopup({
  open: openProp,
  onClose,
  embedded = false,
}: MainImagePopupProps) {
  const titleId = useId();
  const hideId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const canPortal = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isControlled = openProp !== undefined;
  const [autoOpen, setAutoOpen] = useState(!embedded && !isControlled);
  const [hideToday, setHideToday] = useState(false);

  const open = isControlled ? Boolean(openProp) : autoOpen;

  const handleClose = useCallback(() => {
    if (!isControlled) {
      setAutoOpen(false);
    }
    onClose?.();
  }, [isControlled, onClose]);

  useModalFocusTrap(panelRef, open && !embedded);

  useEffect(() => {
    if (!open || embedded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    const scrollY = getWindowScrollY();
    lockPageScroll(scrollY);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockPageScroll(scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [embedded, open, handleClose]);

  if (!open) return null;

  const modalElement = (
    <div
      className={
        embedded
          ? "main_image_popup main_image_popup--embedded"
          : "main_image_popup"
      }
    >
      {!embedded ? <div className="main_image_popup__dim" aria-hidden /> : null}
      <div
        ref={panelRef}
        className="main_image_popup__panel"
        role="dialog"
        aria-modal={embedded ? undefined : true}
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="main_image_popup__title">
          {mainImagePopupContent.dialogLabel}
        </h2>
        <Link
          href={mainImagePopupContent.href}
          className="main_image_popup__media"
          prefetch={false}
          onClick={handleClose}
        >
          <img
            src={mainImagePopupContent.imageSrc}
            alt={mainImagePopupContent.imageAlt}
            width={400}
            height={560}
            decoding="async"
          />
        </Link>
        <div className="main_image_popup__bar">
          <label className="main_image_popup__hide" htmlFor={hideId}>
            <Checkbox
              id={hideId}
              className="guide_checkbox"
              checked={hideToday}
              disableRipple
              icon={<GuideCheckboxIcon {...guideCheckboxIconsDefault} />}
              checkedIcon={
                <GuideCheckboxIcon checked {...guideCheckboxIconsDefault} />
              }
              onChange={(_, checked) => setHideToday(checked)}
              inputProps={{
                "aria-label": mainImagePopupContent.hideTodayLabel,
              }}
            />
            <span className="main_image_popup__hide-label">
              {mainImagePopupContent.hideTodayLabel}
            </span>
          </label>
          <button
            type="button"
            className="main_image_popup__close"
            onClick={handleClose}
          >
            <span className="main_image_popup__close-label">
              {mainImagePopupContent.closeLabel}
            </span>
            <span className="main_image_popup__close-icon" aria-hidden>
              <img
                src="/pub/ico/ico_clear_12_white.svg"
                alt=""
                width={12}
                height={12}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  if (embedded || !canPortal) {
    return modalElement;
  }

  return createPortal(modalElement, document.body);
}
