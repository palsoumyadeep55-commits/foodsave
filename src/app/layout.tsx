import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LocationProvider } from "@/context/location-context";
import { AuthProvider } from "@/context/auth-context";
import { PwaRegister } from "@/components/layout/pwa-register";

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "FoodSave — Unified Food Waste Reduction Platform",
  description:
    "Rescue surplus food, find recipes for expiring groceries, map community fridges, and audit your household carbon footprint.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FoodSave",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#047857" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
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
        <AuthProvider>
          <LocationProvider>
            <PwaRegister />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
