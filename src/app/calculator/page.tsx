"use client";

import React, { useState } from "react";
import { initialWasteLogs } from "@/lib/mock-data";
import { WasteLogEntry, WasteUnit } from "@/types";
import { TipsPanel } from "@/components/calculator/tips-panel";
import { calculateCarbonFootprint, formatDate } from "@/lib/utils";
import { WORLD_COUNTRIES, CountryInfo } from "@/lib/countries";
import {
  Calculator,
  Plus,
  Trash2,
  DollarSign,
  CloudRain,
  Scale,
  Download,
  CheckCircle2,
  Globe2,
  Sun,
  ShieldAlert,
} from "lucide-react";

export default function CalculatorPage() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("IN");
  const [logs, setLogs] = useState<WasteLogEntry[]>(initialWasteLogs);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<any>("Rice & Grains");
  const [quantity, setQuantity] = useState("0.5");
  const [unit, setUnit] = useState<WasteUnit>("kg");
  const [estimatedCost, setEstimatedCost] = useState("40");
  const [reason, setReason] = useState<any>("Left on Plate");
  const [copiedReport, setCopiedReport] = useState(false);

  const selectedCountry =
    WORLD_COUNTRIES.find((c) => c.code === selectedCountryCode) ||
    WORLD_COUNTRIES[0];

  const currency = selectedCountry.currencySymbol;

  // Handle changing country
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const country = WORLD_COUNTRIES.find((c) => c.code === code);
    if (country) {
      // Adjust default item cost based on country currency scale
      if (country.code === "IN") setEstimatedCost("40");
      else if (country.code === "JP" || country.code === "KR") setEstimatedCost("350");
      else if (country.code === "US" || country.code === "CA" || country.code === "AU") setEstimatedCost("3.50");
      else if (country.code === "GB") setEstimatedCost("2.50");
      else if (country.code === "DE" || country.code === "FR" || country.code === "ES") setEstimatedCost("3.00");
      else setEstimatedCost("15");
    }
  };

  // Carbon multipliers per category
  const multipliers: Record<string, number> = {
    Produce: 1.8,
    Dairy: 3.2,
    "Meat & Seafood": 8.0,
    Bakery: 1.8,
    "Prepared Food": 5.0,
    "Rice & Grains": 2.7,
    Other: 2.5,
  };

  const currentMultiplier = multipliers[category] || 2.5;
  const currentWeightKg =
    unit === "kg"
      ? parseFloat(quantity) || 0
      : unit === "lbs"
      ? (parseFloat(quantity) || 0) * 0.453
      : (parseFloat(quantity) || 0) * 0.2; // approx 200g per item

  const previewCarbon = calculateCarbonFootprint(currentWeightKg, currentMultiplier);

  // Aggregated Stats
  const totalWasteKg = logs.reduce((sum, item) => {
    const weight =
      item.unit === "kg"
        ? item.quantity
        : item.unit === "lbs"
        ? item.quantity * 0.453
        : item.quantity * 0.2;
    return sum + weight;
  }, 0);

  const totalCostLost = logs.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalCarbonKg = logs.reduce((sum, item) => sum + item.carbonFootprintKg, 0);

  // Top waste category
  const categoryCounts: Record<string, number> = {};
  logs.forEach((l) => {
    categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
  });
  const topCategory = Object.keys(categoryCounts).reduce(
    (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
    "Rice & Grains"
  );

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const newLog: WasteLogEntry = {
      id: `w-${Date.now()}`,
      itemName: itemName.trim(),
      category,
      quantity: parseFloat(quantity) || 0.1,
      unit,
      estimatedCost: parseFloat(estimatedCost) || 0,
      carbonFootprintKg: previewCarbon,
      reason,
      loggedAt: new Date().toISOString(),
    };

    setLogs([newLog, ...logs]);
    setItemName("");
    setQuantity("0.5");
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  const handleCopyReport = () => {
    const reportText = `🌱 FOODSAVE GLOBAL WASTE & CARBON AUDIT REPORT
Country: ${selectedCountry.name} (${selectedCountry.continent})
Climate Zone: ${selectedCountry.climateZone}
Total Organic Waste Mass: ${totalWasteKg.toFixed(2)} kg
Estimated Money Lost: ${currency}${totalCostLost.toFixed(2)} (${selectedCountry.currencyCode})
Avoidable GHG Impact: ${totalCarbonKg.toFixed(2)} kg CO₂e
Primary Wasted Category: ${topCategory}
Audit Date: ${new Date().toLocaleDateString()}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] pb-24">
      {/* Header Banner */}
      <div className="border-b border-black/[0.06] bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-[0.04em]">
                <Globe2 className="h-4 w-4" />
                <span>Worldwide Waste, Cost & Climate Auditor</span>
              </div>
              <h1 className="mt-1.5 text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.035em]">
                Carbon & Cost Waste Calculator
              </h1>
              <p className="mt-2 text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
                Measure the real financial loss and landfill greenhouse emissions from thrown-away
                groceries across all 195+ world countries and currencies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* World Country & Currency Selector */}
              <div className="flex items-center gap-2 rounded-full border border-black/[0.1] bg-[#f5f5f7] px-4 py-2 text-xs font-medium text-[#1d1d1f]">
                <Globe2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-semibold">Country:</span>
                <select
                  value={selectedCountryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="bg-transparent font-semibold cursor-pointer focus:outline-none"
                >
                  {WORLD_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.currencySymbol} {c.currencyCode})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCopyReport}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2 text-xs font-medium text-white hover:bg-[#333336] transition shadow-xs cursor-pointer"
              >
                {copiedReport ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Audit Copied!
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-[#86868b]" />
                    Export Audit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Regional Climate Zone Banner */}
          <div className="mt-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Region Profile for {selectedCountry.name}:</strong> {selectedCountry.climateZone} Climate Zone ({selectedCountry.continent}).
              </span>
            </div>
            <span className="text-[11px] font-medium text-emerald-800">
              Currency standard: {selectedCountry.currencyName} ({selectedCountry.currencySymbol})
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-7 space-y-7">
        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.04em] text-rose-700">
                Financial Loss
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 font-bold text-xs">
                {currency}
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              {currency}{totalCostLost.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-[#86868b]">
              In {selectedCountry.currencyCode} lost on discarded groceries
            </p>
          </div>

          <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.04em] text-amber-700">
                Total Waste Mass
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Scale className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              {totalWasteKg.toFixed(2)} kg
            </p>
            <p className="mt-1 text-xs text-[#86868b]">Total organic mass diverted</p>
          </div>

          <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.04em] text-emerald-700">
                Carbon Footprint
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CloudRain className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              {totalCarbonKg.toFixed(2)} kg
            </p>
            <p className="mt-1 text-xs text-[#86868b]">CO₂ equivalent emissions produced</p>
          </div>
        </div>

        {/* 2-Column: Form + Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Form */}
          <div className="lg:col-span-7 rounded-[28px] border border-black/[0.08] bg-white p-7 sm:p-8 shadow-xs">
            <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight mb-1 flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-700" />
              Log Discarded Food Item
            </h3>
            <p className="text-xs text-[#6e6e73] mb-6">
              Enter any item thrown away to compute its financial cost and greenhouse emissions in {selectedCountry.name}.
            </p>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                    Food Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cooked rice, flatbreads, greens, curd..."
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-4 py-2.5 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f] transition"
                  >
                    <option value="Rice & Grains">Rice & Grains (Cooked rice, rotis, breads)</option>
                    <option value="Produce">Produce (Vegetables & Fruits)</option>
                    <option value="Dairy">Dairy (Dahi, Paneer, Cheese, Milk)</option>
                    <option value="Bakery">Bakery & Pastries</option>
                    <option value="Prepared Food">Prepared Meals & Stews</option>
                    <option value="Other">Other Organic Food</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                    Quantity
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-20 rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3 py-2 text-xs text-[#1d1d1f] text-center focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as any)}
                      className="flex-1 rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-2.5 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                      <option value="items">items</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                    Estimated Cost ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3.5 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                    Reason
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                  >
                    <option value="Left on Plate">Left on Plate</option>
                    <option value="Spoiled / Expired">Spoiled / Moldy</option>
                    <option value="Overcooked">Overcooked / Burnt</option>
                    <option value="Excess Purchased">Excess Purchased</option>
                  </select>
                </div>
              </div>

              {/* Carbon preview */}
              <div className="flex items-center justify-between rounded-xl bg-[#f5f5f7] p-3 text-xs">
                <span className="text-[#6e6e73] font-medium">
                  Estimated Climate Footprint for this entry:
                </span>
                <span className="font-semibold text-emerald-800">
                  🌱 ~{previewCarbon} kg CO₂e
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-full bg-[#1d1d1f] px-6 py-2.5 text-xs font-medium text-white hover:bg-[#333336] transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add to Waste Log
                </button>
              </div>
            </form>
          </div>

          {/* Tips Panel */}
          <div className="lg:col-span-5">
            <TipsPanel topCategory={topCategory} />
          </div>
        </div>

        {/* Waste Log Table */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-7 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                Recorded Waste Entries
              </h3>
              <p className="text-xs text-[#6e6e73]">
                {logs.length} logged waste items for this household audit
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1d1d1f]">
              <thead className="border-b border-black/[0.06] text-[11px] uppercase tracking-wider text-[#86868b]">
                <tr>
                  <th className="pb-3 font-semibold">Item & Category</th>
                  <th className="pb-3 font-semibold">Quantity</th>
                  <th className="pb-3 font-semibold">Cost ({currency})</th>
                  <th className="pb-3 font-semibold">Carbon</th>
                  <th className="pb-3 font-semibold">Reason</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-black/[0.02] transition">
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-[#1d1d1f]">{log.itemName}</div>
                      <div className="text-[11px] text-[#6e6e73]">{log.category}</div>
                    </td>
                    <td className="py-3.5 pr-4">
                      {log.quantity} {log.unit}
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-rose-700">
                      {currency}{log.estimatedCost.toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-emerald-800">
                      {log.carbonFootprintKg} kg CO₂e
                    </td>
                    <td className="py-3.5 pr-4 text-[#6e6e73]">
                      {log.reason}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="rounded-full p-1.5 text-[#86868b] hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
