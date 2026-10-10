import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FoodSave — Unified Food Waste Reduction Platform",
  description:
    "Rescue surplus food, find recipes for expiring groceries, map community fridges, and audit your household carbon footprint.",
};

import { LocationProvider } from "@/context/location-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-pro-display" />
      </head>
      <body className="min-h-full flex flex-col bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-950">
        <LocationProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocationProvider>
      </body>
    </html>
  );
}
