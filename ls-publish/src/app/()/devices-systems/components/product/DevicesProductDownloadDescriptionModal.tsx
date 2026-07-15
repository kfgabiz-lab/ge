"use client";

import { useEffect, useId } from "react";
import type { ProductDownloadDescription } from "../../data/productDetailContent";

type DevicesProductDownloadDescriptionModalProps = {
  open: boolean;
  title: string;
  version: string;
  description: ProductDownloadDescription;
  onClose: () => void;
};

export default function DevicesProductDownloadDescriptionModal({
  open,
  title,
  version,
  description,
  onClose,
}: DevicesProductDownloadDescriptionModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="devices_download_desc_modal">
      <button
        type="button"
        className="devices_download_desc_modal__dim"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className="devices_download_desc_modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="devices_download_desc_modal__head">
          <div className="devices_download_desc_modal__head-row">
            <h2 id={titleId} className="devices_download_desc_modal__tit">
              {title}
            </h2>
            <button
              type="button"
              className="devices_download_desc_modal__close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <p className="devices_download_desc_modal__version">{version}</p>
          <hr className="devices_download_desc_modal__line" />
        </header>
        <div className="devices_download_desc_modal__body">
          <div className="devices_download_desc_modal__text">
            {description.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" decoding="async"
            src={description.image}
            alt={description.imageAlt ?? ""}
            className="devices_download_desc_modal__img"
          />
        </div>
      </div>
    </div>
  );
}
