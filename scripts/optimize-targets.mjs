import fs from "fs";
import sharp from "sharp";

const targets = [
  "public/img/markets/bg_market.png",
  "public/img/footer/bg_common_footer.png",
];

for (const target of targets) {
  const input = fs.readFileSync(target);
  const base = sharp(input, { failOn: "none" });

  const variants = await Promise.all([
    base.clone().png({ compressionLevel: 9, effort: 10 }).toBuffer(),
    base
      .clone()
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 98, colors: 256 })
      .toBuffer(),
    base
      .clone()
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 95, colors: 256 })
      .toBuffer(),
  ]);

  const smaller = variants.filter((buf) => buf.length < input.length);
  if (smaller.length === 0) {
    console.log(`${target}: skipped`);
    continue;
  }

  const best = smaller.sort((a, b) => a.length - b.length)[0];
  fs.writeFileSync(target, best);

  const beforeKb = Math.round(input.length / 1024);
  const afterKb = Math.round(best.length / 1024);
  const savedPct = Math.round(((input.length - best.length) / input.length) * 100);
  console.log(`${target}: ${beforeKb}KB -> ${afterKb}KB (-${savedPct}%)`);
}
