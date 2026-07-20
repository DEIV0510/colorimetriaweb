import { existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "..", "node_modules", "@mediapipe", "tasks-vision", "wasm");
const dest = join(__dirname, "..", "public", "mediapipe", "wasm");

if (!existsSync(src)) {
  console.warn("[copy-mediapipe-wasm] No se encontró @mediapipe/tasks-vision/wasm, se omite la copia.");
  process.exit(0);
}

mkdirSync(dest, { recursive: true });

for (const file of readdirSync(src)) {
  copyFileSync(join(src, file), join(dest, file));
}

console.log(`[copy-mediapipe-wasm] Copiados los assets WASM a public/mediapipe/wasm`);
