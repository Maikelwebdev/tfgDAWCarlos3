import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoDash v3.2 | TFG - Miguel Developer",
  description: "Dashboard de criptomonedas en tiempo real con análisis de mercado, gráficos interactivos y herramientas Web3. Desarrollado con Next.js, shadcn/ui y CoinGecko API.",
  keywords: ["cryptocurrency", "bitcoin", "ethereum", "crypto dashboard", "web3", "trading"],
  authors: [{ name: "Miguel Developer" }],
  openGraph: {
    title: "CryptoDash v3.2 | TFG",
    description: "Dashboard de criptomonedas en tiempo real",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
