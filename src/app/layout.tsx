import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LocationProvider } from "@/context/location-context";

export const metadata: Metadata = {
  title: "FoodSave — Unified Food Waste Reduction Platform",
  description:
    "Rescue surplus food, find recipes for expiring groceries, map community fridges, and audit your household carbon footprint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="preload"
          href="/fonts/SF-Pro-Display-Semibold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SF-Pro-Text-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fbfbfd] text-[#1d1d1f] antialiased selection:bg-emerald-100 selection:text-emerald-950">
        <LocationProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocationProvider>
      </body>
    </html>
  );
}
