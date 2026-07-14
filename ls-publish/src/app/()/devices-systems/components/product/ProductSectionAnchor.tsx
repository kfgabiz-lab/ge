"use client";

import type { ReactNode } from "react";
import {
  isNearProductSection,
  scrollToProductSection,
} from "../../lib/scrollToProductSection";

type ProductSectionAnchorProps = {
  sectionId: string;
  className?: string;
  children: ReactNode;
};

export default function ProductSectionAnchor({
  sectionId,
  className,
  children,
}: ProductSectionAnchorProps) {
  return (
    <a
      href={`#${sectionId}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();

        if (isNearProductSection(sectionId)) {
          if (window.location.hash !== `#${sectionId}`) {
            window.history.replaceState(null, "", `#${sectionId}`);
          }
          return;
        }

        scrollToProductSection(sectionId);
      }}
    >
      {children}
    </a>
  );
}
