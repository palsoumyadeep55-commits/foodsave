"use client";

import React from "react";
import Link from "next/link";
import { mockSavingsSummary } from "@/lib/mock-data";
import { SavingsSummary } from "@/components/fridge/savings-summary";
import {
  ArrowLeft,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function SavingsDashboardPage() {
  const badges = [
    {
      id: "b1",
      title: "Leftover Legend",
      description: "Cooked 20 meals from expiring food before spoiling",
      icon: "🏆",
      unlocked: true,
      date: "Oct 2026",
    },
    {
      id: "b2",
      title: "Methane Fighter",
      description: "Diverted over 25 kg of CO2 equivalent from landfills",
      icon: "🌍",
      unlocked: true,
      date: "Sep 2026",
    },
    {
      id: "b3",
      title: "Fridge Optimizer",
      description: "Maintained a zero-waste streak for 10 consecutive days",
      icon: "⚡",
      unlocked: true,
      date: "Oct 2026",
    },
    {
      id: "b4",
      title: "Community Hero",
      description: "Donated or dropped off food at a community fridge",
      icon: "🤝",
      unlocked: false,
      date: "In progress (2/3)",
    },
  ];

  const recentSavingsEvents = [
    { id: "e1", item: "Baby Spinach & Cheddar Melt", saved: "$8.40", co2: "1.2 kg", date: "Yesterday" },
    { id: "e2", item: "Overripe Banana Pancakes", saved: "$4.10", co2: "0.8 kg", date: "3 days ago" },
    { id: "e3", item: "Vegetable Soup from Trimmings", saved: "$12.50", co2: "2.4 kg", date: "5 days ago" },
    { id: "e4", item: "Rescued Sourdough Bread Loaf", saved: "$5.00", co2: "0.9 kg", date: "Last week" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/fridge"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fridge
        </Link>

        {/* Big Savings Component */}
        <SavingsSummary summary={mockSavingsSummary} />

        {/* Two column grid: Badges + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Badges / Achievements */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              Impact Badges Earned
            </h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-xl border p-3 flex items-start gap-3 ${
                    b.unlocked
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-zinc-200 bg-zinc-50/50 opacity-60"
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{b.title}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                      {b.description}
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] font-semibold text-emerald-700">
                      {b.unlocked ? `Unlocked • ${b.date}` : b.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Savings Events */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Recent Meal Rescues
            </h3>

            <div className="mt-4 divide-y divide-zinc-100">
              {recentSavingsEvents.map((evt) => (
                <div key={evt.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-zinc-900">{evt.item}</h4>
                    <span className="text-zinc-400 text-[11px]">{evt.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700">{evt.saved}</span>
                    <p className="text-[10px] text-zinc-500">{evt.co2} CO₂ avoided</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
