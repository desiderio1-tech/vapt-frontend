'use client'; // O Layout agora precisa disto para usar o usePathname

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="pt">
      <body className="min-h-screen flex flex-col bg-vapt-gray">
        <Header />
        
        <main className={`flex-1 ${!isAdminPage ? 'pb-16 md:pb-0' : ''}`}>
          {children}
        </main>
        
        {/* Se for a página de admin, escondemos o Footer e a BottomNav */}
        {!isAdminPage && <Footer />}
        {!isAdminPage && <BottomNav />}
        
        <Toaster position="top-right" />
      </body>
    </html>
  );
}