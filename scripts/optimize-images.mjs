/**
 * High-quality in-place optimization for public/img (same filename/extension, no WebP).
 * - JPEG: quality 92, resize only when wider than max
 * - PNG: lossless compression + resize only (no palette — avoids banding on photos/UI)
 * Usage: node scripts/optimize-images.mjs [--dry-run]
 */
import sharp from "sharp";
import { readdir, readFile, writeFile, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMG_DIR = path.join(ROOT, "public", "img");
const DRY_RUN = process.argv.includes("--dry-run");
const MIN_BYTES = 80 * 1024;
const JPEG_QUALITY = 92;
const MIN_SAVINGS_RATIO = 0.03;

function maxWidthFor(relPath) {
  const p = relPath.replace(/\\/g, "/").toLowerCase();
  if (
    /\/(icon_|badge_|logo|ico_)/.test(p) ||
    /\/products\/badge_/.test(p)
  ) {
    return 400;
  }
  if (
    /\/(card_|lineup_|product_|markets_ref|download_|img_benefit)/.test(p) ||
    /\/products\//.test(p) ||
    /\/lineup\//.test(p) ||
    /\/lv-automation\//.test(p)
  ) {
    return 1200;
  }
  if (
    /hero|banner|bg_|highlight|footer|section_main|help_section|overview|application_|why_|common_banner|main_sample/.test(
      p,
    )
  ) {
    return 1920;
  }
  return 1600;
}

async function* walk(dir) {
  for (const name of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png)$/i.test(name.name)) yield full;
  }
}

async function optimizeRaster(filePath) {
  const info = await stat(filePath);
  if (info.size < MIN_BYTES) return null;

  const rel = path.relative(IMG_DIR, filePath);
  const input = await readFile(filePath);
  const meta = await sharp(input).metadata();
  const maxW = maxWidthFor(rel);
  const ext = path.extname(filePath).toLowerCase();

  let pipeline = sharp(input, { failOn: "none" });
  if (meta.width && meta.width > maxW) {
    pipeline = pipeline.resize(maxW, null, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  let output;
  if (ext === ".jpg" || ext === ".jpeg") {
    output = await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();
  } else if (ext === ".png") {
    output = await pipeline
      .png({ compressionLevel: 9, effort: 10 })
      .toBuffer();
  } else {
    return null;
  }

  if (!output || output.length >= input.length * (1 - MIN_SAVINGS_RATIO)) {
    return { rel, skipped: true, before: input.length };
  }

  if (DRY_RUN) {
    return { rel, before: input.length, after: output.length };
  }

  await writeFile(filePath, output);
  return { rel, before: input.length, after: output.length };
}

async function main() {
  const results = [];
  let skipped = 0;
  for await (const file of walk(IMG_DIR)) {
    try {
      const r = await optimizeRaster(file);
      if (!r) continue;
      if (r.skipped) {
        skipped += 1;
        continue;
      }
      results.push(r);
    } catch (err) {
      console.error("FAIL", path.relative(IMG_DIR, file), err.message);
    }
  }

  let saved = 0;
  for (const r of results) {
    saved += r.before - r.after;
    const pct = (((r.before - r.after) / r.before) * 100).toFixed(0);
    console.log(
      `${DRY_RUN ? "[dry] " : ""}${r.rel}: ${(r.before / 1024).toFixed(0)}KB → ${(r.after / 1024).toFixed(0)}KB (-${pct}%)`,
    );
  }

  console.log(
    `\n${DRY_RUN ? "Would optimize" : "Optimized"} ${results.length} files, skipped ${skipped}, saved ~${(saved / 1024 / 1024).toFixed(1)} MB (JPEG q${JPEG_QUALITY}, PNG lossless only)`,
  );
}

main();
