import fs from "node:fs";

const path = "src/assets/css/search.css";
let css = fs.readFileSync(path, "utf8");

const listRenames = [
  ["search_all__media-item-wrap", "search_all__list-item"],
  ["search_all__media-divider", "search_all__list-divider"],
  ["search_all__media-line", "search_all__list-line"],
  ["search_page__item-wrap", "search_all__list-item"],
  ["search_page__divider", "search_all__list-divider"],
  ["search_page__line", "search_all__list-line"],
  [".search_products__list > li", ".search_products__list > .search_all__list-item"],
  [".search_documents__list > li", ".search_documents__list > .search_all__list-item"],
];

for (const [from, to] of listRenames) {
  css = css.split(from).join(to);
}

function removeBlock(start, end) {
  const s = css.indexOf(start);
  const e = css.indexOf(end, s);
  if (s !== -1 && e !== -1) {
    css = css.slice(0, s) + css.slice(e);
  }
}

removeBlock(
  "  section.search_documents .search_documents__card {",
  '    background-image: url("/pub/ico/ico_download.svg");\n  }\n\n',
);

removeBlock(
  "  section.search_documents .search_documents__card .devices_product_downloads__item-head,",
  "  section.search_documents .search_documents__list {",
);

removeBlock(
  "  section.search_products .search_products__item {",
  "  section.search_products .search_products__mo-filter-wrap,",
);

removeBlock(
  "  /* Figma 6571:104661 — product list item card */\n  section.search_products .search_products__list > .search_all__list-item .search_products__item {",
  "  /* Figma 6571:104997 — Documents tab mobile */",
);

css = css.replace(/\.search_documents__card/g, ".search_all__document");

function pairAllDocument(input) {
  let out = input.replace(
    /section\.search_all \.search_all__document(?![a-z])/g,
    "section.search_all .search_all__document,\n  section.search_documents .search_all__document",
  );
  out = out.replace(
    /section\.search_all\n    \.search_all__document(?![a-z])/g,
    "section.search_all\n    .search_all__document,\n  section.search_documents\n    .search_all__document",
  );
  return out.replace(
    /section\.search_documents \.search_all__document,\n  section\.search_documents \.search_all__document/g,
    "section.search_documents .search_all__document",
  );
}

function pairAllProduct(input) {
  let out = input.replace(
    /section\.search_all \.search_all__product(?![a-z])/g,
    "section.search_all .search_all__product,\n  section.search_products .search_all__product",
  );
  return out.replace(
    /section\.search_documents \.search_all__product,\n  section\.search_products \.search_all__product/g,
    "section.search_products .search_all__product",
  ).replace(
    /section\.search_products \.search_all__product,\n  section\.search_products \.search_all__product/g,
    "section.search_products .search_all__product",
  );
}

css = pairAllDocument(css);
css = pairAllProduct(css);

const listItemWidth =
  "  section.search_products .search_products__list > .search_all__list-item {\n    width: 100%;\n  }";

if (css.includes(listItemWidth) && !css.includes("section.search_products .search_products__list .search_all__product")) {
  css = css.replace(
    listItemWidth,
    `${listItemWidth}\n\n  section.search_products .search_products__list .search_all__product {\n    width: 100%;\n  }`,
  );
}

const refreshAnchor = `  section.search_products.devices_product_downloads .support_download_filter-modal__panel,
  section.search_documents.devices_product_downloads .support_download_filter-modal__panel,
  section.search_media.devices_product_downloads .support_download_filter-modal__panel,
  section.search_pages.devices_product_downloads .support_download_filter-modal__panel {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }`;

const refreshBlock = `  section.search_products.devices_product_downloads .support_download_filter-modal__panel,
  section.search_documents.devices_product_downloads .support_download_filter-modal__panel,
  section.search_media.devices_product_downloads .support_download_filter-modal__panel,
  section.search_pages.devices_product_downloads .support_download_filter-modal__panel {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  section.search_products.devices_product_downloads .support_download_filter-modal__divider,
  section.search_documents.devices_product_downloads .support_download_filter-modal__divider,
  section.search_media.devices_product_downloads .support_download_filter-modal__divider,
  section.search_pages.devices_product_downloads .support_download_filter-modal__divider {
    display: block;
    width: 100%;
    height: 1px;
    margin: 0;
    padding: 0;
    border: 0;
    background: #ddd;
  }

  section.search_products.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-head,
  section.search_documents.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-head,
  section.search_media.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-head,
  section.search_pages.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-head {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  section.search_products.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-head-row,
  section.search_documents.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-head-row,
  section.search_media.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-head-row,
  section.search_pages.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__filter-head-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  section.search_products.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh,
  section.search_documents.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh,
  section.search_media.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh,
  section.search_pages.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
  }

  section.search_products.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh-icon,
  section.search_documents.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh-icon,
  section.search_media.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh-icon,
  section.search_pages.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh-icon {
    display: block;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    background: url("/pub/ico/ico_refresh_22.svg") center / contain no-repeat;
    transform-origin: center center;
  }

  section.search_products.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh-icon.is-spinning,
  section.search_documents.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh-icon.is-spinning,
  section.search_media.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh-icon.is-spinning,
  section.search_pages.devices_product_downloads
    .support_download_filter-modal__panel
    .devices_product_downloads__refresh-icon.is-spinning {
    animation: guide_refresh_spin 0.55s ease;
  }`;

if (css.includes(refreshAnchor)) {
  css = css.replace(refreshAnchor, refreshBlock);
}

fs.writeFileSync(path, css);
console.log("search CSS unification applied");
