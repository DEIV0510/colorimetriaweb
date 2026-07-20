import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ColorIA — Colorimetría personal",
    short_name: "ColorIA",
    description:
      "Análisis preliminar de colorimetría personal a partir de una selfie y un breve cuestionario.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF7F2",
    theme_color: "#C17F68",
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
