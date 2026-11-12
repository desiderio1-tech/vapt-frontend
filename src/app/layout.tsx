import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "VAPT — O supermercado de usados mais perto de você",
  description: "Compre e venda produtos usados de forma simples, segura e rápida em Moçambique.",
  manifest: "/manifest.json", // <--- LIGAÇÃO AO MANIFESTO
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VAPT",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#002B5C", // <--- COR DA BARRA DO TELEMÓVEL
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}