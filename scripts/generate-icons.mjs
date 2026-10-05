// Generates the favicon + PWA icon set from the Bilog mascot master PNG.
// Run with: npm run icons
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "public/assets/bilog.png";
const SEA_GLASS = { r: 0xe1, g: 0xf3, b: 0xf0, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** Trim transparent margins and pad to a square tile so the fish fills the icon. */
async function squareMaster() {
  const trimmed = await sharp(SOURCE).trim({ threshold: 1 }).png().toBuffer();
  const { width, height } = await sharp(trimmed).metadata();
  const side = Math.max(width, height);
  return sharp(trimmed)
    .extend({
      top: Math.floor((side - height) / 2),
      bottom: Math.ceil((side - height) / 2),
      left: Math.floor((side - width) / 2),
      right: Math.ceil((side - width) / 2),
      background: TRANSPARENT,
    })
    .png()
    .toBuffer();
}

/** Render the mascot at `size`, occupying `fill` of the tile, over `background`. */
async function renderIcon(master, size, { fill = 0.94, background = TRANSPARENT } = {}) {
  const inner = Math.round(size * fill);
  let fish = sharp(master).resize(inner, inner, { fit: "contain", background: TRANSPARENT });
  if (size <= 48) fish = fish.sharpen({ sigma: 0.6 });
  const fishBuffer = await fish.png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: fishBuffer, gravity: "center" }])
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

/** Build a .ico that embeds PNG images (supported by all modern browsers). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

const master = await squareMaster();
await mkdir("public/icons", { recursive: true });

const icoImages = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await renderIcon(master, size, { fill: 1 }) })));
const outputs = {
  "src/app/favicon.ico": buildIco(icoImages),
  "src/app/icon.png": await renderIcon(master, 512),
  "src/app/apple-icon.png": await renderIcon(master, 180, { fill: 0.82, background: SEA_GLASS }),
  "public/icons/icon-192.png": await renderIcon(master, 192),
  "public/icons/icon-512.png": await renderIcon(master, 512),
  "public/icons/maskable-512.png": await renderIcon(master, 512, { fill: 0.72, background: SEA_GLASS }),
};

for (const [path, data] of Object.entries(outputs)) {
  await writeFile(path, data);
  console.log(`${path}  ${(data.length / 1024).toFixed(1)} KB`);
}
