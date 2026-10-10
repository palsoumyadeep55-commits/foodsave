"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  ShoppingBag,
  Refrigerator,
  MapPin,
  Calculator,
  Menu,
  X,
  PlusCircle,
  Globe2,
} from "lucide-react";
import { useLocation } from "@/context/location-context";

export function Navbar() {
  const { location } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/listings", label: "Surplus Matcher", icon: ShoppingBag },
    { href: "/fridge", label: "Fridge Rescue", icon: Refrigerator },
    { href: "/map", label: "Community Map", icon: MapPin },
    { href: "/calculator", label: "Waste Calculator", icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs group-hover:bg-emerald-800 transition">
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-[-0.03em] text-[#1d1d1f] group-hover:text-emerald-700 transition">
              Food<span className="text-emerald-700">Save</span>
            </span>
            <span className="block text-[9px] font-semibold tracking-[0.05em] text-[#86868b] uppercase -mt-0.5">
              Global Zero Waste
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.01em] transition ${
                  isActive
                    ? "bg-[#1d1d1f] text-white"
                    : "text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-[#86868b]"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Global Badge */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/map"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.06] text-[12px] font-medium text-[#1d1d1f] hover:bg-black/[0.05] transition"
            title={`Active Location: ${location.city}, ${location.country}`}
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>{location.city}, {location.countryCode} ({location.currencySymbol})</span>
          </Link>

          <Link
            href="/listings/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-[#333336] transition shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
            Post Surplus
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/listings/new"
            className="p-2 rounded-full bg-[#1d1d1f] text-white"
            title="Post Surplus"
          >
            <PlusCircle className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#1d1d1f] hover:bg-black/[0.04]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/[0.06] bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-tight ${
                  isActive
                    ? "bg-[#1d1d1f] text-white"
                    : "text-[#6e6e73] hover:bg-black/[0.04]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-[#86868b]"}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
