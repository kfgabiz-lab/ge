"use client";

import { useEffect, useState } from "react";
import { productDetailNavItems } from "../../data/productDetailContent";
import {
  getSectionDocumentTopForNav,
  isNearProductSection,
  PRODUCT_SECTION_ACTIVATE_OFFSET_PX,
  scrollToProductSection,
} from "../../lib/scrollToProductSection";

export type ProductNavItem = { id: string; label: string };

type ProductNavSectionId = string;

type NavSectionEntry = {
  id: ProductNavSectionId;
  element: HTMLElement;
};

const BOTTOM_THRESHOLD_PX = 80;

type DevicesProductNavProps = {
  navItems?: readonly ProductNavItem[];
};

const defaultNavItems: readonly ProductNavItem[] = productDetailNavItems;

function readHashSectionId(sectionIds: ProductNavSectionId[]) {
  const hash = window.location.hash.replace(/^#/, "");
  return sectionIds.includes(hash) ? hash : null;
}

function resolveActiveSectionId(
  sectionIds: ProductNavSectionId[],
): ProductNavSectionId {
  const sections = sectionIds
    .map((id) => {
      const element = document.getElementById(id);
      return element ? { id, element } : null;
    })
    .filter((entry): entry is NavSectionEntry => entry !== null);

  if (sections.length === 0) {
    return sectionIds[0];
  }

  const scrollBottom = window.scrollY + window.innerHeight;
  const pageBottom = document.documentElement.scrollHeight;

  if (scrollBottom >= pageBottom - BOTTOM_THRESHOLD_PX) {
    return sections[sections.length - 1].id;
  }

  const marker = window.scrollY + PRODUCT_SECTION_ACTIVATE_OFFSET_PX;
  let activeId = sections[0].id;

  for (const { id, element } of sections) {
    if (marker >= getSectionDocumentTopForNav(element)) {
      activeId = id;
    }
  }

  return activeId;
}

export default function DevicesProductNav({
  navItems = defaultNavItems,
}: DevicesProductNavProps) {
  const sectionIds: ProductNavSectionId[] = navItems.map((item) => item.id);
  const [activeId, setActiveId] = useState<ProductNavSectionId>(sectionIds[0]);

  useEffect(() => {
    const syncFromHash = () => {
      const hashId = readHashSectionId(sectionIds);
      if (hashId) {
        setActiveId(hashId);
        return;
      }
      setActiveId(resolveActiveSectionId(sectionIds));
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [sectionIds]);

  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      const next = resolveActiveSectionId(sectionIds);
      setActiveId((current) => (current === next ? current : next));
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [sectionIds]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: ProductNavSectionId,
  ) => {
    event.preventDefault();
    setActiveId(sectionId);

    if (!isNearProductSection(sectionId)) {
      scrollToProductSection(sectionId);
    } else if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  };

  return (
    <nav className="devices_product_nav" aria-label="Page sections">
      <ul className="devices_product_nav__list">
        {navItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={
                  isActive
                    ? "devices_product_nav__link is-active"
                    : "devices_product_nav__link"
                }
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => handleNavClick(event, item.id)}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
