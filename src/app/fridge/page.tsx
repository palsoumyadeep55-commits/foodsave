"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initialFridgeIngredients } from "@/lib/mock-data";
import { FridgeIngredientItem } from "@/types";
import { IngredientCard } from "@/components/fridge/ingredient-card";
import { daysUntilExpiry } from "@/lib/utils";
import {
  Refrigerator,
  Plus,
  Sparkles,
  ChefHat,
  TrendingUp,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Globe2,
  UtensilsCrossed,
} from "lucide-react";

export default function FridgePage() {
  const [ingredients, setIngredients] = useState<FridgeIngredientItem[]>(initialFridgeIngredients);
  const [filter, setFilter] = useState<"all" | "urgent" | "safe">("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // New ingredient form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<any>("produce");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("items");
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );

  const [notification, setNotification] = useState<string | null>(null);

  const quickStaples = [
    { name: "Cooked Rice (Basmati / Jasmine)", category: "pantry", qty: 400, unit: "g" },
    { name: "Day-Old Chapatis / Rotis", category: "pantry", qty: 4, unit: "items" },
    { name: "Stale Sourdough / Bread Slices", category: "pantry", qty: 4, unit: "items" },
    { name: "Fresh Palak (Spinach Leaves)", category: "produce", qty: 250, unit: "g" },
    { name: "Fresh Paneer / Tofu Block", category: "dairy", qty: 200, unit: "g" },
    { name: "Overripe Tomatoes", category: "produce", qty: 3, unit: "items" },
    { name: "Curd / Dahi (Yogurt)", category: "dairy", qty: 400, unit: "g" },
    { name: "Ripe Bananas", category: "produce", qty: 3, unit: "items" },
  ];

  const handleQuickAdd = (staple: typeof quickStaples[0]) => {
    const newItem: FridgeIngredientItem = {
      id: `ing-${Date.now()}`,
      name: staple.name,
      category: staple.category as any,
      quantity: staple.qty,
      unit: staple.unit,
      expiryDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split("T")[0],
      addedAt: new Date().toISOString(),
    };
    setIngredients([newItem, ...ingredients]);
    triggerNotification(`Added "${staple.name}". Tap "Find Recipes" to rescue!`);
  };

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: FridgeIngredientItem = {
      id: `ing-${Date.now()}`,
      name: name.trim(),
      category,
      quantity: parseFloat(quantity) || 1,
      unit,
      expiryDate,
      addedAt: new Date().toISOString(),
    };

    setIngredients([newItem, ...ingredients]);
    setName("");
    setShowAddForm(false);
    triggerNotification(`Added "${newItem.name}" to fridge`);
  };

  const handleUseIngredient = (id: string) => {
    const item = ingredients.find((i) => i.id === id);
    setIngredients(ingredients.filter((i) => i.id !== id));
    if (item) {
      triggerNotification(`Great job! Rescued "${item.name}" (+$3.50 saved)`);
    }
  };

  const handleDiscardIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filter and sort items
  const sortedIngredients = [...ingredients].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  const filteredItems = sortedIngredients.filter((item) => {
    const days = daysUntilExpiry(item.expiryDate);
    if (filter === "urgent") return days <= 3;
    if (filter === "safe") return days > 3;
    return true;
  });

  const urgentCount = ingredients.filter((i) => daysUntilExpiry(i.expiryDate) <= 3).length;

  return (
    <div className="min-h-screen bg-[#fbfbfd] pb-24">
      {/* Top Banner */}
      <div className="border-b border-black/[0.06] bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-[0.04em]">
                <Refrigerator className="h-4 w-4" />
                <span>Smart Kitchen Inventory & Expiry Tracker</span>
              </div>
              <h1 className="mt-1.5 text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.035em]">
                Fridge Rescue Planner
              </h1>
              <p className="mt-2 text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
                Track ingredients before they spoil, discover 22+ international recipes tailored to what's in your
                fridge, and prevent household food and money waste.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#333336] transition cursor-pointer"
              >
                <Plus className="h-4 w-4 text-emerald-400" />
                Add Ingredient
              </button>

              <Link
                href="/fridge/recipes"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.1] bg-white px-5 py-2.5 text-xs font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7] transition"
              >
                <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                Find Recipes ({urgentCount} Urgent)
              </Link>
            </div>
          </div>

          {/* Quick-add Common World Staples */}
          <div className="mt-6 pt-6 border-t border-black/[0.06]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider shrink-0">
                Quick-Add Staples:
              </span>
              {quickStaples.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAdd(s)}
                  className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#1d1d1f] hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition shrink-0 cursor-pointer"
                >
                  + {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#1d1d1f] px-6 py-3.5 text-xs font-medium text-white shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-7 space-y-6">
        {/* Urgent Warning Banner */}
        {urgentCount > 0 && (
          <div className="flex items-center justify-between rounded-[22px] border border-rose-200/80 bg-rose-50/70 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-rose-950">
                  {urgentCount} item{urgentCount > 1 ? "s" : ""} expiring in the next 3 days
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Rescue them today with delicious recipes to prevent unnecessary kitchen waste.
                </p>
              </div>
            </div>

            <Link
              href="/fridge/recipes"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-rose-700 px-5 py-2 text-xs font-semibold text-white hover:bg-rose-800 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Rescue With Recipes
            </Link>
          </div>
        )}

        {/* Add Ingredient Form (Collapsible) */}
        {showAddForm && (
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-xs animate-in fade-in duration-200">
            <h3 className="text-sm font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-700" />
              Add an Ingredient to Fridge
            </h3>

            <form onSubmit={handleAddIngredient} className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cooked rice, tortillas, dahi, palak..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3.5 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                >
                  <option value="produce">Produce 🥦</option>
                  <option value="dairy">Dairy 🧀</option>
                  <option value="pantry">Pantry & Grains 🍚</option>
                  <option value="frozen">Frozen ❄️</option>
                  <option value="other">Other 🥗</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                  Quantity
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-16 rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-2 py-2 text-xs text-[#1d1d1f] text-center focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="flex-1 rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-2 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                  >
                    <option value="items">items</option>
                    <option value="g">grams</option>
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1d1d1f] mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f]"
                />
              </div>

              <div className="sm:col-span-5 flex justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6e6e73] hover:bg-black/[0.04] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1d1d1f] hover:bg-[#333336] rounded-full transition"
                >
                  Save to Fridge
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filter === "all"
                  ? "bg-[#1d1d1f] text-white"
                  : "bg-white text-[#6e6e73] border border-black/[0.08] hover:bg-[#f5f5f7]"
              }`}
            >
              All Items ({ingredients.length})
            </button>
            <button
              onClick={() => setFilter("urgent")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filter === "urgent"
                  ? "bg-rose-700 text-white"
                  : "bg-white text-[#6e6e73] border border-black/[0.08] hover:bg-[#f5f5f7]"
              }`}
            >
              ⚠️ Expiring Soon ({urgentCount})
            </button>
            <button
              onClick={() => setFilter("safe")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filter === "safe"
                  ? "bg-emerald-700 text-white"
                  : "bg-white text-[#6e6e73] border border-black/[0.08] hover:bg-[#f5f5f7]"
              }`}
            >
              Fresh ({ingredients.length - urgentCount})
            </button>
          </div>

          <Link
            href="/fridge/recipes"
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>View 22+ Smart Recipes</span>
            <Sparkles className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <IngredientCard
              key={item.id}
              ingredient={item}
              onUse={handleUseIngredient}
              onDiscard={handleDiscardIngredient}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
