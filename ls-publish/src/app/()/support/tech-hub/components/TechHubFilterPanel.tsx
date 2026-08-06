"use client";

import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import {
  techHubCertifications,
  techHubProductCategories,
} from "@/data/support/techHubContent";
import { useTechHubFilter } from "./TechHubFilterProvider";

type TechHubFilterPanelProps = {
  variant?: "sidebar" | "modal";
};

export default function TechHubFilterPanel({
  variant = "sidebar",
}: TechHubFilterPanelProps) {
  const { isChecked, toggleFilter, clearSection } = useTechHubFilter();

  const panelClass =
    variant === "sidebar"
      ? "support_download_filter--pc"
      : "support_download_filter-modal__panel";

  const productCategorySection = (
    <DevicesProductDownloadsFilterSection
      title="Product Category"
      compactHead={variant === "modal"}
      onRefresh={() => clearSection("category")}
    >
      {techHubProductCategories.map((option) => (
        <DevicesProductDownloadsCategoryFilterRow
          key={option.id}
          option={option}
          idPrefix="th-category"
          isChecked={isChecked}
          onToggle={toggleFilter}
        />
      ))}
    </DevicesProductDownloadsFilterSection>
  );

  const certificationSection = (
    <DevicesProductDownloadsFilterSection
      title="Certification"
      variant={variant === "sidebar" ? "certification" : undefined}
      compactHead={variant === "modal"}
      onRefresh={() => clearSection("certification")}
    >
      {techHubCertifications.map((option) => {
        const filterId = `th-cert-${option.id}`;

        return (
          <DevicesProductDownloadsFilterCheckRow
            key={option.id}
            id={filterId}
            label={option.label}
            count={option.count}
            defaultChecked={option.defaultChecked}
            checked={isChecked(filterId)}
            onCheckedChange={(checked) => toggleFilter(filterId, checked)}
          />
        );
      })}
    </DevicesProductDownloadsFilterSection>
  );

  if (variant === "modal") {
    return (
      <div className={panelClass}>
        {productCategorySection}
        <hr className="support_download_filter-modal__divider" aria-hidden />
        {certificationSection}
      </div>
    );
  }

  return (
    <DevicesProductDownloadsFilter className={panelClass}>
      {productCategorySection}
      {certificationSection}
    </DevicesProductDownloadsFilter>
  );
}
