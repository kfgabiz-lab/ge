"use client";

import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import GnbMenu from "@/components/layout/shared/GnbMenu";
import HeaderBreadcrumb from "@/components/layout/shared/HeaderBreadcrumb";
import { useHeaderScroll } from "@/components/layout/shared/useHeaderScroll";
import { getWindowScrollY } from "@/lib/lenisScroll";
import {
  isDevicesProductDetailPath,
  MAIN_PATH,
} from "@/lib/navigation/crossSectionNav";
const SUB_TOP_THRESHOLD = 8;

export default function SubHeader() {
  const pathname = usePathname();
  const isProductDetail = isDevicesProductDetailPath(pathname);
  const [isMegaOpen, setIsMegaOpen] = useState(false);  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [frozenWrapAtTop, setFrozenWrapAtTop] = useState<boolean | null>(null);

  const { isAtTop, isGnbHidden: scrollGnbHidden, isHeaderRevealed, revealHeader } =
    useHeaderScroll({
      hideGnbOnScroll: !isMobileMenuOpen && !isMegaOpen,
    });

  const isGnbHidden = scrollGnbHidden && !isSearchOpen;
  const resolvedIsAtTop =
    frozenWrapAtTop !== null ? frozenWrapAtTop : isAtTop;

  const handleMegaOpenChange = useCallback((open: boolean) => {
    if (open) {
      setFrozenWrapAtTop(
        (prev) => prev ?? getWindowScrollY() <= SUB_TOP_THRESHOLD,
      );
    } else if (!isSearchOpen) {
      requestAnimationFrame(() => {
        setFrozenWrapAtTop(null);
      });
    }
    setIsMegaOpen(open);
  }, [isSearchOpen]);

  const handleSearchOpenChange = useCallback((open: boolean) => {
    if (open) {
      setFrozenWrapAtTop(
        (prev) => prev ?? getWindowScrollY() <= SUB_TOP_THRESHOLD,
      );
    } else if (!isMegaOpen) {
      requestAnimationFrame(() => {
        setFrozenWrapAtTop(null);
      });
    }
    setIsSearchOpen(open);
  }, [isMegaOpen]);

  const wrapClassName = useMemo(
    () =>
      [
        "sub_header-wrap",
        resolvedIsAtTop && "is-at-top",
        isGnbHidden && "is-gnb-hidden",
        isSearchOpen && "is-search-open",
        isProductDetail && "is-product-detail",
      ]        .filter(Boolean)
        .join(" "),
    [resolvedIsAtTop, isGnbHidden, isSearchOpen, isProductDetail],  );

  return (
    <div className={wrapClassName}>
      <GnbMenu
        logoHref={MAIN_PATH}
        isAtTop={resolvedIsAtTop}
        isHeaderHidden={isGnbHidden}
        isHeaderRevealed={isHeaderRevealed}
        onRevealHeader={revealHeader}
        breadcrumb={<HeaderBreadcrumb />}
        onMegaOpenChange={handleMegaOpenChange}
        onSearchOpenChange={handleSearchOpenChange}
        onMobileMenuOpenChange={setIsMobileMenuOpen}
      />
    </div>
  );
}
