/**
 * convert-images.mjs
 * Converts heavy PNGs to WebP using sharp.
 * Run: node scripts/convert-images.mjs
 */
import { createRequire } from "module";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

// Images to convert: [source, dest, quality, resize?]
const targets = [
  // sastra.png is 6.4MB — huge. Target: < 200KB WebP
  { src: "sastra.png",    dest: "sastra.webp",    quality: 82, width: 1200 },
  // ben10.png is 777KB — Target: < 100KB WebP
  { src: "ben10.png",     dest: "ben10.webp",     quality: 85, width: null  },
];

let sharp;
try {
  const require = createRequire(import.meta.url);
  sharp = require("sharp");
} catch {
  console.error("❌ sharp not installed. Run: npm install --save-dev sharp");
  process.exit(1);
}

let converted = 0;
for (const { src, dest, quality, width } of targets) {
  const srcPath  = join(publicDir, src);
  const destPath = join(publicDir, dest);

  if (!existsSync(srcPath)) {
    console.warn(`⚠️  Skipped (not found): ${src}`);
    continue;
  }

  let pipeline = sharp(srcPath);
  if (width) pipeline = pipeline.resize(width, null, { withoutEnlargement: true });
  await pipeline.webp({ quality }).toFile(destPath);

  const { size: srcSize }  = (await import("fs")).statSync(srcPath);
  const { size: destSize } = (await import("fs")).statSync(destPath);
  const saved = (((srcSize - destSize) / srcSize) * 100).toFixed(1);
  console.log(`✅ ${src} → ${dest}  (${(srcSize/1024).toFixed(0)}KB → ${(destSize/1024).toFixed(0)}KB, -${saved}%)`);
  converted++;
}

console.log(`\n🎉 Done: ${converted} images converted.`);
console.log("🔧 Next: update src references in code to use .webp extensions.");
