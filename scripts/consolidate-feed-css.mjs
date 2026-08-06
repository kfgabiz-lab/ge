const fs = require("fs");
const p = "src/assets/css/company.css";
let c = fs.readFileSync(p, "utf8");
const start = c.indexOf("/* === Company Press (Figma 3525:39068) === */");
const end = c.indexOf("/* === Company Events (Figma 3525:39276) === */");
if (start === -1 || end === -1) {
  console.error("markers not found", start, end);
  process.exit(1);
}
const blogHover = [
  "section.company-blog-list .company-blog-list__content:hover .company-blog-list__title {",
  "  text-decoration: underline;",
  "  text-decoration-thickness: 1px;",
  "  text-underline-offset: 4px;",
  "}",
  "",
  "section.company-blog-top .company-blog-featured__content:hover .company-blog-featured__title {",
  "  text-decoration: underline;",
  "  text-decoration-thickness: 1px;",
  "  text-underline-offset: 4px;",
  "}",
  "",
].join("\n");
const replacement =
  "/* Press · Articles · Blog 공통 리스트/타이틀/노데이터 — company-feed.css */\n\n" +
  blogHover;
c = c.slice(0, start) + replacement + c.slice(end);
c = c.replace(
  /section\.company-blog-list \.company-blog-list__toolbar \.guide_field__select-value \{[\s\S]*?\}\n\n/,
  "",
);
fs.writeFileSync(p, c);
console.log("lines", c.split("\n").length);
