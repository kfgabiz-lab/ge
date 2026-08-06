"use client";

import GnbMegaItemLink from "@/components/layout/shared/gnb-mega/GnbMegaItemLink";
import type { GnbMegaSimplePanelStateProps } from "@/components/layout/shared/gnb-mega/types";
import type { GnbSimpleMegaSection } from "@/data/gnb";
import { companyMegaMenu } from "@/data/gnb/mega/company";

/** Figma 8793:231732 — #gnb-mega-panel-company */
export default function GnbCompanyMegaPanel({
  onItemClick,
  onClose,
}: GnbMegaSimplePanelStateProps) {
  const sections =
    companyMegaMenu.layout === "sections" ? companyMegaMenu.sections : [];

  return (
    <div className="gnb_mega__inner gnb_mega__inner--sections">
      {onClose ? (
        <button
          type="button"
          className="gnb_mega__close"
          aria-label="메뉴 닫기"
          onClick={onClose}
        >
          <span className="ir">close menu</span>
        </button>
      ) : null}
      <div className="gnb_mega__head">
        <h2 className="gnb_mega__tit">Company</h2>
      </div>
      <div className="gnb_mega__divider" aria-hidden />
      <div className="gnb_mega__columns">
        {sections.map((section) => (
          <SectionsColumn
            key={section.id}
            section={section}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

function SectionsColumn({
  section,
  onItemClick,
}: {
  section: GnbSimpleMegaSection;
  onItemClick?: () => void;
}) {
  return (
    <section className="gnb_mega__col" aria-label={section.label}>
      <p className="gnb_mega__col-label">{section.label}</p>
      <div className="gnb_mega__col-list">
        {section.items.map((item) => (
          <GnbMegaItemLink
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            descVariant="section"
          />
        ))}
      </div>
    </section>
  );
}
