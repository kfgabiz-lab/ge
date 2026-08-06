import fs from "node:fs";

const path = "src/assets/css/search.css";
let css = fs.readFileSync(path, "utf8");

function removeBetween(start, end) {
  const s = css.indexOf(start);
  const e = css.indexOf(end, s);
  if (s !== -1 && e !== -1) css = css.slice(0, s) + css.slice(e);
}

removeBetween(
  "  section.search_documents .search_documents__card {",
  '    background-image: url("/pub/ico/ico_download.svg");\n  }\n\n',
);

removeBetween(
  "  section.search_documents .search_documents__card .devices_product_downloads__item-head,",
  "  section.search_documents .search_documents__list {",
);

css = css.replace(
  /section\.search_documents\n    \.search_documents__card/g,
  "section.search_documents\n    .search_all__document",
);

css = css.replace(
  /section\.search_documents \.search_documents__card/g,
  "section.search_documents .search_all__document",
);

const lines = css.split(/\r?\n/);
const out = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  if (
    line.startsWith("  section.search_all .search_all__document") &&
    !line.includes("section.search_documents") &&
    line.includes("{")
  ) {
    const selector = line.slice(0, line.indexOf("{")).trimEnd().replace(/,$/, "");
    const rest = line.slice(line.indexOf("{"));
    out.push(`  ${selector},`);
    out.push(`  ${selector.replace("section.search_all", "section.search_documents")}${rest}`);
    i += 1;
    continue;
  }

  if (
    line === "  section.search_all" &&
    i + 1 < lines.length &&
    lines[i + 1].trimStart().startsWith(".search_all__document")
  ) {
    const block = [line];
    let j = i + 1;
    while (j < lines.length && !lines[j].includes("{")) {
      block.push(lines[j]);
      j += 1;
    }
    if (j < lines.length) block.push(lines[j]);
    const selector = block
      .join("\n")
      .replace(/^\s+/, "")
      .replace(/\s*\{\s*$/, "")
      .trimEnd();
    if (!selector.includes("section.search_documents")) {
      out.push(block.join("\n") + ",");
      out.push(
        selector.replace(/section\.search_all/g, "section.search_documents") +
          (lines[j].includes("{") ? " {" : ""),
      );
      if (!lines[j].includes("{")) {
        // shouldn't happen
      }
      i = j + 1;
      continue;
    }
  }

  out.push(line);
  i += 1;
}

css = out.join("\n");

fs.writeFileSync(path, css);
console.log("document CSS unified");
