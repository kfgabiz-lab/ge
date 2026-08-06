"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export default function SessionDetailTableScroll({
  children,
}: {
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeHidden, setSwipeHidden] = useState(false);

  const hideSwipe = useCallback(() => {
    setSwipeHidden(true);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const syncOverflow = () => {
      if (el.scrollWidth <= el.clientWidth + 1) {
        hideSwipe();
      }
    };

    const onScroll = () => {
      if (el.scrollLeft > 0) hideSwipe();
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.touches[0];
      if (!start || !touch) return;

      const dx = Math.abs(touch.clientX - start.x);
      const dy = Math.abs(touch.clientY - start.y);

      if (dx > 8 && dx >= dy) {
        hideSwipe();
        touchStartRef.current = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > 0 || el.scrollLeft > 0) {
        hideSwipe();
      }
    };

    syncOverflow();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", syncOverflow);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", syncOverflow);
    };
  }, [hideSwipe]);

  return (
    <div className="support_service_training_session_detail__table-viewport">
      <div
        ref={scrollRef}
        className="support_service_training_session_detail__table-wrap"
      >
        {children}
      </div>
      <div
        className={`support_service_training_session_detail__table-swipe${
          swipeHidden ? " is-hidden" : ""
        }`}
        aria-hidden
      >
        <img
          className="support_service_training_session_detail__table-swipe-icon"
          src="/pub/ico/ico_swipe_70.svg"
          alt=""
          width={70}
          height={70}
          loading="lazy"
          decoding="async"
        />
        <p className="support_service_training_session_detail__table-swipe-label">
          Swipe
        </p>
      </div>
    </div>
  );
}
