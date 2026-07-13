const fs = require("fs");
const { execSync } = require("child_process");

const gitCss = execSync("git show HEAD:src/assets/css/company.css", {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});

const startMarker = "/* === Company Article Detail (blog / press 공통) === */";
const endMarkers = [
  "/* === Company Press (Figma 3525:39068) === */",
  "/* Press · Articles · Blog 공통",
];

const start = gitCss.indexOf(startMarker);
if (start === -1) {
  console.error("start marker not found in git");
  process.exit(1);
}

let end = -1;
for (const marker of endMarkers) {
  const idx = gitCss.indexOf(marker, start + startMarker.length);
  if (idx !== -1) {
    end = idx;
    break;
  }
}
if (end === -1) {
  console.error("end marker not found in git");
  process.exit(1);
}

const articleDetailBlock = gitCss.slice(start, end);
const cssPath = "src/assets/css/company.css";
let css = fs.readFileSync(cssPath, "utf8");

const insertAfter =
  "section.company-blog-top .company-blog-featured__content:hover .company-blog-featured__title {\n  text-decoration: underline;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 4px;\n}\n";

const insertPoint = css.indexOf(insertAfter);
if (insertPoint === -1) {
  console.error("insert point not found");
  process.exit(1);
}

const afterInsert = insertPoint + insertAfter.length;
if (css.includes(startMarker)) {
  console.log("Article detail CSS already present");
  process.exit(0);
}

const blogListHover = `section.company-blog-list .company-blog-list__content:hover .company-blog-list__title {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

`;

css =
  css.slice(0, afterInsert) +
  "\n" +
  blogListHover +
  articleDetailBlock +
  "\n" +
  css.slice(afterInsert);

fs.writeFileSync(cssPath, css);
console.log("Restored article detail CSS:", articleDetailBlock.split("\n").length, "lines");
