import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Sacramento } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PwaSetup } from "@/components/layout/PwaSetup";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
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

export const metadata: Metadata = {
  title: "Colorimetría · Alma e Imagen",
  description:
    "Descubre los colores que armonizan contigo. Análisis de colorimetría personal a partir de una selfie, procesado en tu propio dispositivo.",
  appleWebApp: {
    capable: true,
    title: "Colorimetría",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
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
