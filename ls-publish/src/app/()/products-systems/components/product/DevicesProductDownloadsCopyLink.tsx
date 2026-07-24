"use client";

import { useEffect, useRef, useState } from "react";

const LOADING_MS = 1000;
const TOAST_MS = 1000;

type CopyPhase = "idle" | "loading" | "copied";

type DevicesProductDownloadsCopyLinkProps = {
  /** Clipboard text. Defaults to current page URL. */
  url?: string;
  className?: string;
  /** When true, "Link copied!" toast stays until the next click. */
  persistToast?: boolean;
};

export default function DevicesProductDownloadsCopyLink({
  url,
  className = "",
  persistToast = false,
}: DevicesProductDownloadsCopyLinkProps) {
  const [phase, setPhase] = useState<CopyPhase>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const handleCopy = async () => {
    if (phase === "loading") return;

    clearTimers();
    setPhase("loading");

    const text = url ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      if (text) await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable */
    }

    const showToast = setTimeout(() => {
      setPhase("copied");
      if (!persistToast) {
        const hideToast = setTimeout(() => {
          setPhase("idle");
        }, TOAST_MS);
        timersRef.current.push(hideToast);
      }
    }, LOADING_MS);
    timersRef.current.push(showToast);
  };

  const btnClass = [
    "devices_product_downloads__file-btn",
    "devices_product_downloads__file-btn--copy",
    className,
    phase === "loading" ? "is-loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={btnClass}
      onClick={handleCopy}
      aria-busy={phase === "loading"}
      aria-live="polite"
    >
      {phase === "copied" ? (
        <span className="devices_product_downloads__copy-toast" role="status">
          Link copied!
        </span>
      ) : null}
      <span className="devices_product_downloads__file-btn-label">Copy Link</span>
      <span
        className="devices_product_downloads__file-btn-icon"
        aria-hidden="true"
      />
      <span
        className="devices_product_downloads__file-btn-spinner"
        aria-hidden="true"
      />
    </button>
  );
}
