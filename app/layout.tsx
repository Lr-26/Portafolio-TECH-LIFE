import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z-RAI | Elite Architecture & AI",
  description: "Diseñamos la arquitectura técnica de las empresas que liderarán la próxima década. Software de alto rendimiento e IA estratégica.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Z-RAI | Elite Software & AI",
    description: "Diseñamos la arquitectura técnica de las empresas que liderarán la próxima década. Software de alto rendimiento e IA estratégica.",
    url: "https://z-rai.vercel.app",
    siteName: "Z-RAI",
    images: [
      {
        url: "https://z-rai.vercel.app/og-image.jpg", // TBD if he uploads one, fallback is automatic usually or defaults to generic
        width: 1200,
        height: 630,
        alt: "Z-RAI Elite Software",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

import { LanguageProvider } from "./context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${outfit.variable}`} suppressHydrationWarning>
       <body style={{ margin: 0 }} suppressHydrationWarning>
        <div className="bg-glow"></div>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
