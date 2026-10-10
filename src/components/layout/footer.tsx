"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Heart, Globe, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-black/[0.06] bg-[#f5f5f7] text-[#6e6e73]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-2xs">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                Food<span className="text-emerald-700">Save</span>
              </span>
            </div>
            <p className="text-[12px] text-[#86868b] leading-relaxed">
              One-third of all food produced globally goes to waste. We empower communities, kitchens, and local businesses to cut food loss to zero.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full w-fit">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              100% Free for Food Banks & Individuals
            </div>
          </div>

          {/* Module Links */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#1d1d1f] tracking-tight">Platform Modules</h4>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li>
                <Link href="/listings" className="hover:text-[#1d1d1f] transition">
                  Leftover Matcher (Surplus Food)
                </Link>
              </li>
              <li>
                <Link href="/fridge" className="hover:text-[#1d1d1f] transition">
                  Fridge Rescue & Recipes
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-[#1d1d1f] transition">
                  Community Fridge Map
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-[#1d1d1f] transition">
                  Carbon & Cost Waste Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Impact & Resources */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#1d1d1f] tracking-tight">Food Waste Facts</h4>
            <ul className="mt-3 space-y-2 text-[12px] text-[#86868b] leading-relaxed">
              <li>• 1.3 Billion tons of food wasted each year globally</li>
              <li>• 8-10% of global greenhouse emissions stem from food waste</li>
              <li>• Rotting food in landfills emits potent methane gas (CH4)</li>
              <li>• Average family saves up to $1,500/yr with waste planning</li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#1d1d1f] tracking-tight">Community & Action</h4>
            <p className="mt-3 text-[12px] text-[#86868b] leading-relaxed">
              Know a restaurant with surplus food or a community fridge not on the map?
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/listings/new"
                className="inline-flex items-center justify-center rounded-full bg-[#1d1d1f] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#333336] transition"
              >
                Register as a Donor
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center justify-center rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[12px] font-medium text-[#1d1d1f] hover:bg-zinc-100 transition"
              >
                Find Nearest Fridge
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-black/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#86868b] gap-4">
          <p>© 2026 FoodSave Platform. Built for zero waste & food security.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>for the planet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
