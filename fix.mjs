import sharp from 'sharp';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const targets = [
  'public/sponsors/platinum/cub-logo.jpg',
  'public/sponsors/new/platinum/ias-academy.jpeg',
  'public/sponsors/platinum/temple-city-sports-club.jpg',
  'public/sponsors/platinum/mrs-logo.jpg',
  'public/sponsors/gold/fuel-logo.jpg',
  'public/sponsors/gold/dudes-mens-wear-logo.jpg',
  'public/sponsors/new/silver/vsn jewels.jpeg',
  'public/sponsors/silver/triple-c-logo.jpg',
  'public/sponsors/silver/frozen-bottle-logo.jpeg',
  'public/sponsors/media/rdg-logo.jpg',
  'public/backgrounds/sastra-2.jpeg'
];

async function fix() {
  const log = [];
  log.push('Starting fix run...');
  
  for (const t of targets) {
    if (existsSync(t)) {
      const out = t.replace(/\.(jpg|jpeg|png)$/, '.webp');
      try {
        await sharp(t).webp({ quality: 80 }).toFile(out);
        log.push(`✅ Fixed ${t}`);
      } catch (e) {
        log.push(`❌ Failed ${t}: ${e.message}`);
      }
    } else {
      log.push(`❓ Missing source: ${t}`);
    }
  }
  
  writeFileSync('fix-log.txt', log.join('\n'));
}

fix();
