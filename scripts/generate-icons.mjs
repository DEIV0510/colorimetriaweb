// Genera los iconos PWA provisionales (wordmark "C" sobre marfil) sin dependencias externas.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

const IVORY = [251, 247, 242];
const CLAY = [193, 127, 104];
const ESPRESSO = [46, 32, 25];

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // truecolor RGB
  const raw = Buffer.alloc((width * 3 + 1) * height);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    raw[pos++] = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      raw[pos++] = pixels[i];
      raw[pos++] = pixels[i + 1];
      raw[pos++] = pixels[i + 2];
    }
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Dibuja una "C" tipográfica sencilla: anillo con una muesca a la derecha.
function makeIcon(size, maskable) {
  const pixels = Buffer.alloc(size * size * 3);
  const cx = size / 2;
  const cy = size / 2;
  const scale = maskable ? 0.62 : 0.76;
  const outer = (size * scale) / 2;
  const inner = outer * 0.62;
  const notchHalfAngle = 0.42;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 3;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      let color = IVORY;
      const inRing = dist <= outer && dist >= inner;
      const inNotch = Math.abs(angle) < notchHalfAngle;
      if (inRing && !inNotch) color = CLAY;
      else if (dist < inner * 0.34) color = ESPRESSO;

      pixels[i] = color[0];
      pixels[i + 1] = color[1];
      pixels[i + 2] = color[2];
    }
  }
  return encodePng(size, size, pixels);
}

writeFileSync(join(outDir, "icon-192.png"), makeIcon(192, false));
writeFileSync(join(outDir, "icon-512.png"), makeIcon(512, false));
writeFileSync(join(outDir, "icon-maskable-512.png"), makeIcon(512, true));
writeFileSync(join(outDir, "apple-touch-icon.png"), makeIcon(180, false));

console.log("[generate-icons] Iconos PWA generados en public/icons");
