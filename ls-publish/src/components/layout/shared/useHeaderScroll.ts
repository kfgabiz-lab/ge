"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createRafScrollHandler } from "@/lib/createThrottledScrollHandler";
import { getWindowScrollY } from "@/lib/lenisScroll";
import {
  resolveAtTop,
  resolveGnbScrollVisibility,
  type GnbScrollVisibility,
} from "@/lib/gnbScrollState";

const DEFAULT_TOP_THRESHOLD = 8;

export type HeaderMode = "full" | "hidden" | "revealed";

type UseHeaderScrollOptions = {
  /** 스크롤 이하 구간에서 투명(최상단) 상태 — main: 80 */
  topThreshold?: number;
  /** false면 모바일처럼 GNB 숨김 없이 full / revealed만 사용 */
  hideGnbOnScroll?: boolean;
};

function toHeaderMode(isAtTop: boolean, visibility: GnbScrollVisibility): HeaderMode {
  if (isAtTop) return "full";
  return visibility === "hidden" ? "hidden" : "revealed";
}

export function useHeaderScroll(options?: UseHeaderScrollOptions) {
  const topThreshold = options?.topThreshold ?? DEFAULT_TOP_THRESHOLD;
  const hideGnbOnScroll = options?.hideGnbOnScroll ?? true;
  const [isAtTop, setIsAtTop] = useState(true);
  const [headerMode, setHeaderMode] = useState<HeaderMode>("full");
  const isAtTopRef = useRef(true);
  const headerModeRef = useRef<HeaderMode>("full");
  const visibilityRef = useRef<GnbScrollVisibility>("visible");
  const anchorScrollYRef = useRef(0);
  const lastModeChangeAtRef = useRef(0);
  const hideGnbRef = useRef(hideGnbOnScroll);

  hideGnbRef.current = hideGnbOnScroll;

  const updateScrollState = useCallback(() => {
    if (!hideGnbRef.current) return;

    const currentScrollY = getWindowScrollY();
    const wasAtTop = isAtTopRef.current;
    const atTop = resolveAtTop(currentScrollY, wasAtTop, topThreshold);

    if (atTop !== wasAtTop) {
      isAtTopRef.current = atTop;
      setIsAtTop(atTop);
    }

    if (atTop) {
      visibilityRef.current = "visible";
      anchorScrollYRef.current = currentScrollY;
      lastModeChangeAtRef.current = Date.now();

      if (headerModeRef.current !== "full") {
        headerModeRef.current = "full";
        setHeaderMode("full");
      }
      return;
    }

    // 최상단 이탈 시 흰 GNB(is-invert revealed)를 건너뛰고 바로 남색 브레드크럼 상태
    if (wasAtTop) {
      const now = Date.now();
      visibilityRef.current = "hidden";
      anchorScrollYRef.current = currentScrollY;
      lastModeChangeAtRef.current = now;

      if (headerModeRef.current !== "hidden") {
        headerModeRef.current = "hidden";
        setHeaderMode("hidden");
      }
      return;
    }

    const result = resolveGnbScrollVisibility({
      currentScrollY,
      anchorScrollY: anchorScrollYRef.current,
      topThreshold,
      hideOnScroll: hideGnbRef.current,
      currentVisibility: visibilityRef.current,
      lastModeChangeAt: lastModeChangeAtRef.current,
      wasAtTop: false,
    });

    anchorScrollYRef.current = result.anchorScrollY;
    lastModeChangeAtRef.current = result.lastModeChangeAt;
    visibilityRef.current = result.visibility;

    const nextMode = toHeaderMode(false, result.visibility);
    if (nextMode !== headerModeRef.current) {
      headerModeRef.current = nextMode;
      setHeaderMode(nextMode);
    }
  }, [topThreshold]);

  useEffect(() => {
    // 초기 wasAtTop=true 유지 → 이미 스크롤된 채 진입해도 leave-top 분기로 바로 hidden
    isAtTopRef.current = true;
    headerModeRef.current = "full";
    visibilityRef.current = "visible";
    anchorScrollYRef.current = getWindowScrollY();
    lastModeChangeAtRef.current = 0;
    setIsAtTop(true);
    setHeaderMode("full");
    updateScrollState();

    const handleScroll = createRafScrollHandler(updateScrollState);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [topThreshold, updateScrollState]);

  /* 메가·모바일 메뉴 오픈 중(body scroll lock)에는 scrollY가 0으로 보이므로 isAtTop 갱신 생략 */
  useEffect(() => {
    if (!hideGnbOnScroll) return;
    updateScrollState();
  }, [hideGnbOnScroll, updateScrollState]);

  const revealHeader = useCallback(() => {
    if (headerModeRef.current === "hidden") {
      const now = Date.now();
      headerModeRef.current = "revealed";
      visibilityRef.current = "visible";
      anchorScrollYRef.current = getWindowScrollY();
      lastModeChangeAtRef.current = now;
      setHeaderMode("revealed");
    }
  }, []);

  return {
    headerMode,
    isAtTop,
    isGnbHidden: hideGnbOnScroll && headerMode === "hidden",
    isHeaderRevealed:
      headerMode === "revealed" || headerMode === "full",
    revealHeader,
  };
}
