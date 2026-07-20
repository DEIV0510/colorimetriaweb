import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PwaSetup } from "@/components/layout/PwaSetup";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ColorIA — Descubre los colores que mejor armonizan contigo",
  description:
    "Análisis preliminar de colorimetría personal a partir de una selfie y un breve cuestionario. Resultado orientativo, procesado en tu propio navegador.",
  appleWebApp: {
    capable: true,
    title: "ColorIA",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C17F68",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-espresso">
        <Header />
        {children}
        <Footer />
        <PwaSetup />
      </body>
    </html>
  );
}
