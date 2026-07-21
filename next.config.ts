import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// Única fuente de verdad para la ruta de los binarios WASM: la versión instalada
// del paquete, así el script de copia y el runtime nunca se desincronizan.
// Se lee del sistema de archivos porque el paquete no expone "./package.json"
// en su campo `exports` y un require() fallaría.
const mediapipeVersion = (
  JSON.parse(
    readFileSync(
      join(process.cwd(), "node_modules", "@mediapipe", "tasks-vision", "package.json"),
      "utf8"
    )
  ) as { version: string }
).version;

// Las cabeceras van aquí y no en vercel.json porque Netlify ignora ese archivo:
// definidas en next.config las respetan Vercel y @netlify/plugin-nextjs por igual.
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_MEDIAPIPE_VERSION: mediapipeVersion,
  },
  async headers() {
    return [
      {
        // El modelo y los binarios WASM quedan deliberadamente fuera del service
        // worker, así que esta cabecera es su única capa de caché (~15 MB).
        // La ruta lleva versión para que un bump del paquete no sirva binarios
        // viejos contra un bundle nuevo.
        source: "/models/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // La ruta lleva la versión del paquete, así que el contenido nunca cambia
        // bajo la misma URL: es seguro cachearlo un año. Sin versionar, cada
        // visitante recurrente volvería a bajar ~11 MB.
        source: "/mediapipe/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
