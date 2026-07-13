import type { ProductDownloadItem } from "@/app/()/products-systems/data/productDetailContent";
import {
  searchProductCategories,
  searchProductDocumentTypes,
} from "@/data/search/searchProductsContent";
import type { DownloadFilterOption } from "@/data/support/downloadCenterContent";

/** Figma 6430:111072 — Search Documents tab + filter */
export const searchDocumentsPage = {
  totalResults: 2658,
  pageSize: 10,
} as const;

/** Figma 6571:104998 — default active filter chips (demo; driven by filter provider) */
export const searchDocumentActiveFilterDefaults = [
  { id: "search-document-category-mccb-susol-ul", group: "Category", value: "Susol UL MCCB" },
  { id: "search-document-type-catalogs", group: "Types", value: "Catalog" },
  { id: "search-document-type-manuals", group: "Types", value: "Manuals" },
] as const;

export const searchDocumentCategories = searchProductCategories;

export const searchDocumentTypes: DownloadFilterOption[] = searchProductDocumentTypes;

const catalogFiles = [
  { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
  { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
] as const;

const manualFiles = [
  { name: "LS_Solution_Overview_EN_CZZZ02-04-202603 DC Device", size: "" },
  { name: "[HVDC_and_FACTS]_EN_C84602-02-201905.pdf", size: "4.62MB" },
  { name: "MC-800a, 630a, 500a.pdf", size: "12.09MB" },
  { name: "Metasol MS_MC-800a_500-800A_3P_2D CAD.pdf", size: "5.23MB" },
] as const;

/** Figma 6430:111082 · 111083 · 111085 — document card templates */
const documentTemplates: ProductDownloadItem[] = [
  {
    id: "sd-t1",
    type: "Catalog",
    title: "LV SWGR Smart LV Solution DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [...catalogFiles],
  },
  {
    id: "sd-t2",
    type: "Catalog",
    title: "DC Device LV SWGR Smart LV Solution",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    files: [...catalogFiles],
  },
  {
    id: "sd-t3",
    type: "Manual",
    title: "EMPR [UL SPD]USPE Series Manual DC Device",
    highlight: "DC Device",
    date: "Dec 9, 2025",
    version: "V38.0",
    versions: ["V38.0", "V37.0"],
    files: [...manualFiles],
  },
];

/** Figma 6430:111072 — page 1 accordion order */
const searchDocumentsFirstPageTemplateIndices = [0, 1, 0, 2, 0, 0, 0, 1, 0, 0] as const;

const documentPool: ProductDownloadItem[] = searchDocumentsFirstPageTemplateIndices.map(
  (templateIndex, slotIndex) => {
    const source = documentTemplates[templateIndex];
    return {
      ...source,
      id: `${source.id}-slot-${slotIndex}`,
    };
  },
);

export function getSearchDocumentPageItems(
  page: number,
  pageSize: number,
): ProductDownloadItem[] {
  const start = (page - 1) * pageSize;
  const items: ProductDownloadItem[] = [];

  for (let i = 0; i < pageSize; i++) {
    const globalIndex = start + i;
    const source = documentPool[globalIndex % documentPool.length];
    items.push({
      ...source,
      id: `${source.id}-p${page}-${i}`,
    });
  }

  return items;
}
