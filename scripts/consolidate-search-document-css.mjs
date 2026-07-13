import fs from "node:fs";

const path = "src/assets/css/search.css";
let css = fs.readFileSync(path, "utf8");

const desktopStart = "  section.search_documents .search_documents__card {";
const desktopEnd =
  '    background-image: url("/pub/ico/ico_download.svg");\n  }\n\n  section.search_documents .search_documents__pagination,';

const desktopStartIdx = css.indexOf(desktopStart);
const desktopEndIdx = css.indexOf(desktopEnd);
if (desktopStartIdx !== -1 && desktopEndIdx !== -1) {
  css =
    css.slice(0, desktopStartIdx) +
    css.slice(desktopEndIdx + '    background-image: url("/pub/ico/ico_download.svg");\n  }\n\n'.length);
}

const mobileStart =
  "  section.search_documents .search_documents__card .devices_product_downloads__item-head,";
const mobileEnd = "  section.search_documents .search_documents__list {";

const mobileStartIdx = css.indexOf(mobileStart);
const mobileEndIdx = css.indexOf(mobileEnd);
if (mobileStartIdx !== -1 && mobileEndIdx !== -1) {
  css = css.slice(0, mobileStartIdx) + css.slice(mobileEndIdx);
}

css = css.replace(/\.search_documents__card/g, ".search_all__document");

css = css.replace(
  /(^  section\.search_all \.search_all__document)(?!,\n  section\.search_documents)/gm,
  "$1,\n  section.search_documents .search_all__document",
);

const multilineNeedle = "  section.search_all\n    .search_all__document";
let searchFrom = 0;
while (true) {
  const idx = css.indexOf(multilineNeedle, searchFrom);
  if (idx === -1) break;
  const slice = css.slice(idx, idx + 120);
  if (!slice.includes("section.search_documents")) {
    css =
      css.slice(0, idx + multilineNeedle.length) +
      ",\n  section.search_documents\n    .search_all__document" +
      css.slice(idx + multilineNeedle.length);
    searchFrom = idx + multilineNeedle.length + 60;
  } else {
    searchFrom = idx + multilineNeedle.length;
  }
}

fs.writeFileSync(path, css);
console.log("consolidated search document CSS");
