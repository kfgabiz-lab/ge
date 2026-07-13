import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSS_PATH = path.join(__dirname, "..", "src", "assets", "css", "search.css");

const FILTER_TABS = ["products", "documents", "media", "pages"];
const FILTER_TAB_SECTIONS = FILTER_TABS.map(
  (tab) => `  section.search_${tab}.devices_product_downloads`,
).join(",\n");
const CATEGORY_TAB_SECTIONS = ["products", "documents"]
  .map((tab) => `  section.search_${tab}.devices_product_downloads`)
  .join(",\n");

function commaTabSelectors(suffix, tabs = FILTER_TABS) {
  return tabs.map((tab) => `  section.search_${tab} .search_${tab}${suffix}`).join(",\n");
}

function buildSharedMobileBlock() {
  const moWrap = commaTabSelectors("__mo-filter-wrap");
  const moBtn = commaTabSelectors("__mo-filter");
  const moLabel = commaTabSelectors("__mo-filter-label");
  const moIcon = commaTabSelectors("__mo-filter-icon");
  const pagination = commaTabSelectors("__pagination");
  const filterPc = FILTER_TABS.map(
    (tab) =>
      `  section.search_${tab} .search_${tab}__filter.devices_product_downloads__filter-stack--pc`,
  ).join(",\n");
  const main = commaTabSelectors("__main");
  const nestedSections = FILTER_TABS.map(
    (tab) => `  section.search_all section.search_${tab}.devices_product_downloads`,
  ).join(",\n");
  const nestedInner = FILTER_TABS.map(
    (tab) => `  section.search_all section.search_${tab} .inner`,
  ).join(",\n");
  const countDivider = commaTabSelectors("__count", ["documents", "media", "pages"]);
  const countStrongDivider = ["documents", "media", "pages"]
    .map((tab) => `  section.search_${tab} .search_${tab}__count strong`)
    .join(",\n");
  const results = commaTabSelectors("__results", ["documents", "media", "pages"]);
  const listBlock = commaTabSelectors("__list-block", ["media", "pages"]);
  const bodySelectors = FILTER_TABS.map(
    (tab) => `  section.search_${tab}.devices_product_downloads .devices_product_downloads__body`,
  ).join(",\n");

  return `
  /* — Search filter tabs — shared mobile (products · documents · media · pages) */
${nestedSections} {
    padding: 0;
    background: transparent;
  }

${nestedInner} {
    padding-left: 0;
    padding-right: 0;
  }

${FILTER_TAB_SECTIONS} {
    padding: 0 0 80px;
    background: #fff;
  }

${bodySelectors} {
    display: flex;
    flex-direction: column;
    gap: 0;
    grid-template-columns: 1fr;
  }

${filterPc} {
    display: none;
  }

${main} {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    min-width: 0;
  }

${listBlock} {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    min-width: 0;
  }

${moWrap} {
    display: block;
    width: 100%;
  }

${moBtn} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    min-height: 50px;
    margin: 0;
    padding: 0 20px;
    font: inherit;
    font-size: 15px;
    line-height: 23px;
    color: #222;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    appearance: none;
    cursor: pointer;
  }

${moLabel} {
    min-width: 0;
    text-align: left;
  }

${moIcon} {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
  }

${moIcon} img {
    display: block;
    width: 14px;
    height: 14px;
  }

${results} {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    min-width: 0;
  }

${countDivider} {
    margin: 0;
    padding-bottom: 14px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    line-height: 22px;
    color: #666;
  }

${countStrongDivider} {
    font-weight: 500;
    color: #222;
  }

${pagination} {
    margin-top: 0;
  }

${pagination}.page-numbering {
    width: 100%;
  }

${pagination} .page-numbering__inner {
    gap: 2.5px;
    justify-content: center;
  }

${pagination} .page-numbering__control {
    width: 30px;
    height: 30px;
    border-radius: 4px;
  }

${pagination} .page-numbering__page {
    width: 38px;
    height: 38px;
    font-size: 15px;
    font-weight: 400;
    line-height: 23px;
    color: #666;
    border-radius: 4px;
  }

${pagination} .page-numbering__page.is-active {
    border-radius: 20px;
    background: #0f1f45;
    color: #fff;
    font-weight: 600;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal {
    display: block !important;
    position: fixed;
    inset: 0;
    z-index: 1200;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__overlay {
    display: none;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__sheet {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #fff;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__head {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid rgb(34 34 34 / 10%);
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__tit {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    letter-spacing: -0.24px;
    color: #222;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__body {
    flex: 1;
    overflow-y: auto;
    padding: 40px 20px;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__panel {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-section {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-tit {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    color: #222;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__check-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    cursor: pointer;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__check-label {
    display: inline;
    min-width: 0;
    max-width: none;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-size: 15px;
    font-weight: 400;
    line-height: 23px;
    color: #222;
    text-align: left;
    cursor: pointer;
    text-wrap: balance;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__check-label-count {
    flex-shrink: 0;
    color: #666;
    margin-left: 4px;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__check {
    display: flex;
    align-items: center;
    align-self: flex-start;
    flex-shrink: 0;
    height: 24px;
    padding: 1px 0 0;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root {
    padding: 0;
    color: transparent;
    border-radius: 4px;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root.Mui-checked,
${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root:hover,
${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root.Mui-focusVisible {
    color: transparent;
    background-color: transparent;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox.MuiCheckbox-root
    .MuiSvgIcon-root {
    display: none;
  }

${FILTER_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .guide_checkbox__icon {
    display: block;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    object-fit: contain;
  }

${CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__category-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  }

${CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-arrow--14 {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    background: url("/pub/ico/ico_down_16.svg") 6px 8px / 10px no-repeat;
    cursor: pointer;
    transform: rotate(0deg);
    transition: transform 0.25s ease;
  }

${CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-arrow--14.is-open {
    transform: rotate(180deg);
    transform-origin: center;
  }

${CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-list--nested {
    margin-top: 16px;
    padding-left: 32px;
  }

${CATEGORY_TAB_SECTIONS}
    .support_download_filter-modal__panel
    .devices_product_downloads__category-row
    .devices_product_downloads__check-row {
    flex: 1;
    min-width: 0;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__foot {
    flex-shrink: 0;
    height: 60px;
    background: #0f1f45;
  }

${FILTER_TAB_SECTIONS} .support_download_filter-modal__apply {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    font: inherit;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    color: #fff;
    background: transparent;
    border: none;
    cursor: pointer;
  }

`;
}

function removeBlock(text, startMarker, endMarker, fromIndex = 0) {
  const start = text.indexOf(startMarker, fromIndex);
  if (start === -1) return text;
  const end = text.indexOf(endMarker, start + startMarker.length);
  if (end === -1) return text;
  return text.slice(0, start) + text.slice(end);
}

function mobileIndex(text) {
  const idx = text.indexOf("@media (max-width: 780px)");
  return idx === -1 ? 0 : idx;
}

let text = fs.readFileSync(CSS_PATH, "utf8");

// Desktop fixes applied manually; insert shared block only.
if (false) {
  const duplicateStart =
    "  section.search_products .search_products__active-filters {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    margin-bottom: 28px;\n  }\n\n  section.search_products .search_products__active-filters-chips";
  // ...
}

const oldHide = null; // already grouped
if (oldHide && text.includes(oldHide)) {
  text = text.replace(oldHide, newHide);
}

const anchor = "  /* Figma 6571:104644 — Products tab mobile */";
if (!text.includes("/* — Search filter tabs — shared mobile")) {
  text = text.replace(anchor, buildSharedMobileBlock() + anchor);
  console.log("Inserted shared mobile block");
}

const removals = []; // manual cleanup after insert

for (const [startMarker, endMarker] of removals) {
  const before = text.length;
  text = removeBlock(text, startMarker, endMarker, mobileIndex(text));
  if (text.length !== before) {
    console.log(`Removed ${before - text.length} chars: ${startMarker.slice(0, 50)}...`);
  } else {
    console.log(`SKIP: ${startMarker.slice(0, 50)}...`);
  }
}

while (text.includes("\n\n\n\n")) {
  text = text.replace(/\n\n\n\n/g, "\n\n\n");
}

fs.writeFileSync(CSS_PATH, text, "utf8");
console.log(`Updated ${CSS_PATH} (${text.split("\n").length} lines)`);
