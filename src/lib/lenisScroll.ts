import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/** GNB·모달 등 오버레이 공통 — globals.css `html.is-page-scroll-lock` */
const PAGE_SCROLL_LOCK_CLASS = "is-page-scroll-lock";

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis;
}

export function getLenisInstance() {
  return lenisInstance;
}

/** Lenis root 스크롤 또는 네이티브 scrollY */
export function getWindowScrollY() {
  if (lenisInstance) {
    return lenisInstance.scroll;
  }

  return window.scrollY || document.documentElement.scrollTop;
}

type ScrollWindowOptions = {
  immediate?: boolean;
  behavior?: ScrollBehavior;
};

export function scrollWindowTo(
  top: number,
  options?: ScrollWindowOptions,
) {
  const immediate =
    options?.immediate ?? options?.behavior === "auto";

  if (lenisInstance) {
    lenisInstance.scrollTo(top, { immediate });
    return;
  }

  window.scrollTo({
    top,
    behavior: immediate ? "auto" : (options?.behavior ?? "auto"),
  });
}

/** 오버레이 오픈 전 레이아웃 변화가 scrollY를 바꾸지 않도록 동기 잠금 */
export function lockPageScroll(scrollY: number) {
  const lenis = lenisInstance;

  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    scrollY + window.innerHeight,
  );

  /*
    scroll-lock 클래스를 Lenis stop()보다 먼저 적용.
    .lenis-stopped { overflow: clip }이 스크롤바를 지우기 전에
    is-page-scroll-lock으로 overflow-y: scroll을 유지한다.
  */
  document.documentElement.classList.add(PAGE_SCROLL_LOCK_CLASS);
  document.documentElement.style.height = `${docHeight}px`;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.height = `${docHeight}px`;

  /* 관성 스크롤을 끊은 뒤 stop — 딤 뒤 흔들림 방지 */
  lenis?.scrollTo(scrollY, { immediate: true });
  lenis?.stop();
}

/** body fixed 해제 후 Lenis·네이티브 스크롤 위치 복원 */
export function unlockPageScroll(scrollY: number) {
  document.documentElement.classList.remove(PAGE_SCROLL_LOCK_CLASS);
  document.documentElement.style.height = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.height = "";

  const lenis = lenisInstance;
  lenis?.start();

  const restore = () => {
    scrollWindowTo(scrollY, { immediate: true });
  };

  restore();

  requestAnimationFrame(() => {
    restore();

    if (Math.abs(getWindowScrollY() - scrollY) > 2) {
      requestAnimationFrame(restore);
    }
  });
}
