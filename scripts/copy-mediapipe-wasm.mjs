import { existsSync, mkdirSync, copyFileSync, readdirSync, rmSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Los binarios WASM de MediaPipe no se versionan en git (pesan ~33 MB): se copian
// desde node_modules en cada instalación. Sin ellos la detección facial no
// arranca y la cámara queda inservible, así que este script FALLA en vez de
// avisar y seguir: un despliegue roto en silencio es peor que un build que corta.
//
// El destino lleva la versión del paquete (public/mediapipe/<version>/) para que
// los assets puedan cachearse como immutable sin que un bump del paquete deje
// binarios viejos sirviendo contra un bundle JS nuevo.
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(__dirname, "..", "node_modules", "@mediapipe", "tasks-vision");
const src = join(pkgDir, "wasm");
const root = join(__dirname, "..", "public", "mediapipe");

if (!existsSync(src)) {
  console.error(
    `[copy-mediapipe-wasm] ERROR: no se encontró ${src}\n` +
      "La app no puede analizar rostros sin estos binarios.\n" +
      "Ejecuta `npm install` (sin --omit=optional ni --production) y reintenta."
  );
  process.exit(1);
}

const { version } = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const dest = join(root, version);

// Limpia versiones anteriores para que no se acumulen en el bundle de despliegue.
if (existsSync(root)) {
  for (const entry of readdirSync(root)) {
    if (entry !== version) rmSync(join(root, entry), { recursive: true, force: true });
  }
}

mkdirSync(dest, { recursive: true });

const copied = [];
for (const file of readdirSync(src)) {
  copyFileSync(join(src, file), join(dest, file));
  copied.push(file);
}

// El runtime carga el glue .js junto a su .wasm emparejado; si faltara alguno el
// fallo aparecería en el navegador del usuario, no aquí.
const required = ["vision_wasm_internal.js", "vision_wasm_internal.wasm"];
const missing = required.filter((f) => !copied.includes(f));
if (missing.length > 0) {
  console.error(`[copy-mediapipe-wasm] ERROR: faltan archivos esperados: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(
  `[copy-mediapipe-wasm] ${copied.length} assets copiados a public/mediapipe/${version}`
);
