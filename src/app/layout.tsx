import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COREXE BEST - Oyun Hesap, UC ve Sosyal Medya Satışı",
  description: "PUBG Mobile hesap satışı, UC paketleri ve sosyal medya hesapları. Güvenilir ve hızlı teslimat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased bg-mesh min-h-screen`}>
        <CartProvider>
          <Header />
          <main className="pt-20 pb-12 min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
