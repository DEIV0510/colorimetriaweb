import type { NextConfig } from "next";

// Las cabeceras van aquí y no en vercel.json porque Netlify ignora ese archivo:
// definidas en next.config las respetan Vercel y @netlify/plugin-nextjs por igual.
const nextConfig: NextConfig = {
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
        source: "/mediapipe/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
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
