import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav"; // Importação da nova barra
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "VAPT — O supermercado de usados mais perto de você",
  description: "Compre e venda produtos usados de forma simples, segura e rápida em Moçambique.",
  manifest: "/manifest.json",
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
  themeColor: "#002B5C",
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
      <body className="min-h-screen flex flex-col bg-vapt-gray">
        <Header />
        
        {/* O pb-16 adiciona espaço no fundo no telemóvel para a barra não tapar o conteúdo */}
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        
        <Footer />
        
        {/* A Barra de Navegação Inferior (só aparece no telemóvel) */}
        <BottomNav />
        
        <Toaster position="top-right" />
      </body>
    </html>
  );
}