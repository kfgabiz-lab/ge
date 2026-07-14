/** GNB + sticky sub-nav clearance — matches scroll-margin-top in devices-product-detail.css */
export const PRODUCT_SECTION_SCROLL_OFFSET_PX = 200;

export const PRODUCT_SECTION_ACTIVATE_OFFSET_PX =
  PRODUCT_SECTION_SCROLL_OFFSET_PX + 24;

export function getSectionDocumentTop(element: HTMLElement) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function getScrollBehavior(
  override?: ScrollBehavior,
  distancePx = 0,
): ScrollBehavior {
  if (override) return override;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "auto";
  }
  return distancePx > window.innerHeight * 0.6 ? "smooth" : "auto";
}

type ScrollToProductSectionOptions = {
  behavior?: ScrollBehavior;
  updateHash?: boolean;
};

/**
 * Scroll to a product section (JS path — uses explicit offset, not scrollIntoView).
 * Full-page loads with a hash use native scrolling + CSS scroll-margin-top only.
 */
export function scrollToProductSection(
  sectionId: string,
  options: ScrollToProductSectionOptions = {},
) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const targetTop = Math.max(
    0,
    getSectionDocumentTop(element) - PRODUCT_SECTION_SCROLL_OFFSET_PX,
  );
  const distance = Math.abs(window.scrollY - targetTop);
  const behavior = getScrollBehavior(options.behavior, distance);

  window.scrollTo({ top: targetTop, behavior });

  if (options.updateHash !== false) {
    const hash = `#${sectionId}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }
}

export function isNearProductSection(sectionId: string, thresholdPx = 48) {
  const element = document.getElementById(sectionId);
  if (!element) return false;

  const targetTop = Math.max(
    0,
    getSectionDocumentTop(element) - PRODUCT_SECTION_SCROLL_OFFSET_PX,
  );

  return Math.abs(window.scrollY - targetTop) <= thresholdPx;
}

export function getSectionDocumentTopForNav(element: HTMLElement) {
  return getSectionDocumentTop(element);
}
