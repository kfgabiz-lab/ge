"use client";

import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import {
  downloadDocumentTypes,
  downloadProductCategories,
} from "@/data/support/downloadCenterContent";
import { useDownloadCenterFilter } from "./DownloadCenterFilterProvider";

type DownloadCenterFilterPanelProps = {
  variant?: "sidebar" | "modal";
};

export default function DownloadCenterFilterPanel({
  variant = "sidebar",
}: DownloadCenterFilterPanelProps) {
  const { isChecked, toggleFilter, clearSection } = useDownloadCenterFilter();

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
      {downloadProductCategories.map((option) => (
        <DevicesProductDownloadsCategoryFilterRow
          key={option.id}
          option={option}
          idPrefix="dc-category"
          isChecked={isChecked}
          onToggle={toggleFilter}
        />
      ))}
    </DevicesProductDownloadsFilterSection>
  );

  const documentTypeSection = (
    <DevicesProductDownloadsFilterSection
      title="Document Type"
      variant={variant === "sidebar" ? "document" : undefined}
      compactHead={variant === "modal"}
      onRefresh={() => clearSection("document")}
    >
      {downloadDocumentTypes.map((option) => {
        const filterId = `dc-doc-${option.id}`;

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
        {documentTypeSection}
      </div>
    );
  }

  return (
    <DevicesProductDownloadsFilter className={panelClass}>
      {productCategorySection}
      {documentTypeSection}
    </DevicesProductDownloadsFilter>
  );
}
