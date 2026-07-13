import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "src");
const TARGET_EXT = new Set([".tsx", ".jsx", ".html"]);

let scanned = 0;
let changedFiles = 0;
let updatedTags = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!TARGET_EXT.has(path.extname(entry.name))) continue;
    scanned += 1;

    const original = fs.readFileSync(fullPath, "utf8");
    const next = original.replace(/<img\b[\s\S]*?>/g, (tag) => {
      if (/\bloading\s*=/.test(tag)) return tag;

      const injected = tag.replace(
        /<img\b/,
        '<img loading="lazy" decoding="async"',
      );
      updatedTags += 1;
      return injected;
    });

    if (next !== original) {
      fs.writeFileSync(fullPath, next, "utf8");
      changedFiles += 1;
    }
  }
}

walk(SRC_DIR);
console.log(
  `scanned:${scanned} changed_files:${changedFiles} updated_tags:${updatedTags}`,
);
