import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSS_PATH = path.join(__dirname, "..", "src", "assets", "css", "search.css");

let css = fs.readFileSync(CSS_PATH, "utf8");
const start = css.indexOf("  /* — Search filter tabs — shared mobile");
const end = css.indexOf("  /* Figma 6571:104644 — Products tab mobile */");
let block = css.slice(start, end);

const tabs = ["products", "documents", "media", "pages"];
const nl = "\r\n";
let count = 0;

function expandRule(source, tabList) {
  const prefix = tabList
    .map((tab) => `  section.search_${tab}.devices_product_downloads`)
    .join(`,${nl}`);
  const pattern = new RegExp(
    `${prefix.replace(/\./g, "\\.")}(\\,[\\s\\S]*?\\{)`,
    "g",
  );
  return source.replace(pattern, (_, rest) => {
    count += 1;
    const suffix = rest.slice(0, -1);
    return tabList.map((tab) => `  section.search_${tab}.devices_product_downloads${suffix}`).join(`,${nl}`) + "{";
  });
}

// Fix 4-tab rules where only pages had the child selector attached.
const brokenFour = `  section.search_products.devices_product_downloads,${nl}  section.search_documents.devices_product_downloads,${nl}  section.search_media.devices_product_downloads,${nl}  section.search_pages.devices_product_downloads`;
const fourPattern = new RegExp(
  `${brokenFour.replace(/\./g, "\\.")}([\\s\\S]*?\\{)`,
  "g",
);
block = block.replace(fourPattern, (_, rest) => {
  count += 1;
  const suffix = rest.slice(0, -1);
  return tabs.map((tab) => `  section.search_${tab}.devices_product_downloads${suffix}`).join(`,${nl}`) + "{";
});

// Fix 2-tab category rules (products + documents).
const brokenTwo = `  section.search_products.devices_product_downloads,${nl}  section.search_documents.devices_product_downloads`;
const twoPattern = new RegExp(
  `${brokenTwo.replace(/\./g, "\\.")}([\\s\\S]*?\\{)`,
  "g",
);
block = block.replace(twoPattern, (_, rest) => {
  count += 1;
  const suffix = rest.slice(0, -1);
  return ["products", "documents"]
    .map((tab) => `  section.search_${tab}.devices_product_downloads${suffix}`)
    .join(`,${nl}`) + "{";
});

css = css.slice(0, start) + block + css.slice(end);
fs.writeFileSync(CSS_PATH, css, "utf8");
console.log(`Fixed ${count} selector groups in shared mobile block`);
