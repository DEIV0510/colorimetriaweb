import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Sacramento } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PwaSetup } from "@/components/layout/PwaSetup";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Mismas familias tipográficas que Alma e Imagen · The Academy.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const SHARE_DESCRIPTION =
  "Descubre los colores que armonizan contigo: tu estación, tu paleta y cómo llevarla. Con una selfie que se procesa en tu propio dispositivo.";

// El favicon, el ícono de Apple y la imagen para compartir salen de los
// archivos app/favicon.ico, app/icon.png, app/apple-icon.png y
// app/opengraph-image.jpg. metadataBase vuelve absolutas sus URLs, que es lo
// que exigen WhatsApp y Facebook para mostrar la vista previa.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Colorimetría · Alma e Imagen",
  description:
    "Descubre los colores que armonizan contigo. Análisis de colorimetría personal de Alma e Imagen · The Academy, procesado en tu propio dispositivo.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Alma e Imagen · The Academy",
    title: "Colorimetría · Alma e Imagen",
    description: SHARE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Colorimetría · Alma e Imagen",
    description: SHARE_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    title: "Colorimetría",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D6207E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${montserrat.variable} ${sacramento.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-blush text-ink">
        <Header />
        {children}
        <Footer />
        <PwaSetup />
        <ScrollReveal />
      </body>
    </html>
  );
}
