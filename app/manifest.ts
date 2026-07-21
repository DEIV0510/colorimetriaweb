import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Colorimetría · Alma e Imagen",
    short_name: "Colorimetría",
    description:
      "Descubre los colores que armonizan contigo. Herramienta de colorimetría de Alma e Imagen · The Academy.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF6FA",
    theme_color: "#D6207E",
    lang: "es",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
