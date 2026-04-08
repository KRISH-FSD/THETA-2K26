/**
 * convert-images.mjs
 * Converts heavy PNG, JPG, JPEG to WebP using sharp.
 */
import { createRequire } from "module";
import { existsSync, readdirSync, statSync, appendFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, relative, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");
const logFile = join(__dirname, "../conversion-log-v2.txt");

writeFileSync(logFile, "Starting image conversion V2...\n");

let sharp;
try {
  const require = createRequire(import.meta.url);
  sharp = require("sharp");
  appendFileSync(logFile, "✅ Sharp loaded.\n");
} catch (err) {
  appendFileSync(logFile, "❌ Sharp failed: " + err.message + "\n");
  process.exit(1);
}

function getAllImageFiles(dirPath, arrayOfFiles) {
  const files = readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllImageFiles(fullPath, arrayOfFiles);
    } else {
      const ext = extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg"].includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

const allImages = getAllImageFiles(publicDir);
appendFileSync(logFile, `🔍 Found ${allImages.length} image files (.png, .jpg, .jpeg).\n`);

let totalSaved = 0;
let converted = 0;

for (const srcPath of allImages) {
  const relPath = relative(publicDir, srcPath);
  const ext = extname(srcPath);
  const webpPath = srcPath.slice(0, -ext.length) + ".webp";
  
  try {
    const srcSize = statSync(srcPath).size;
    if (srcSize < 2048) continue; // Skip < 2KB (smaller threshold)

    let pipeline = sharp(srcPath);
    const metadata = await pipeline.metadata();
    if (metadata.width > 2000) {
      appendFileSync(logFile, `📏 Resizing ${relPath} (${metadata.width}px → 1920px)\n`);
      pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
    }

    await pipeline.webp({ quality: 80 }).toFile(webpPath);

    const destSize = statSync(webpPath).size;
    const saved = srcSize - destSize;
    totalSaved += saved;
    appendFileSync(logFile, `✅ ${relPath} optimized: ${(srcSize/1024).toFixed(0)}KB → ${(destSize/1024).toFixed(0)}KB\n`);
    converted++;
  } catch (err) {
    appendFileSync(logFile, `❌ Failed ${relPath}: ${err.message}\n`);
  }
}

appendFileSync(logFile, `\n🎉 Finished! Converted ${converted} images, saved ${(totalSaved/(1024*1024)).toFixed(2)} MB.\n`);
