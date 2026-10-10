"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { initialFridgeIngredients } from "@/lib/mock-data";
import { FridgeIngredientItem } from "@/types";
import { IngredientCard } from "@/components/fridge/ingredient-card";
import { BarcodeScannerModal } from "@/components/fridge/barcode-scanner-modal";
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
  Camera,
  ScanBarcode,
  RefreshCw,
} from "lucide-react";

export default function FridgePage() {
  const [ingredients, setIngredients] = useState<FridgeIngredientItem[]>(initialFridgeIngredients);
  const [filter, setFilter] = useState<"all" | "urgent" | "safe">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // New ingredient form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<any>("produce");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("items");
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );

  const [notification, setNotification] = useState<string | null>(null);

  const fetchLiveIngredients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fridge");
      const data = await res.json();
      if (data.success && data.ingredients && data.ingredients.length > 0) {
        setIngredients(data.ingredients);
      }
    } catch {
      // Keep fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveIngredients();
  }, []);

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

  const handleQuickAdd = async (staple: typeof quickStaples[0]) => {
    const expiry = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split("T")[0];
    try {
      const res = await fetch("/api/fridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: staple.name,
          category: staple.category,
          quantity: staple.qty,
          unit: staple.unit,
          expiryDate: expiry,
        }),
      });
      const data = await res.json();
      if (data.success && data.ingredient) {
        setIngredients([data.ingredient, ...ingredients]);
      } else {
        const fallback: FridgeIngredientItem = {
          id: `ing-${Date.now()}`,
          name: staple.name,
          category: staple.category as any,
          quantity: staple.qty,
          unit: staple.unit,
          expiryDate: expiry,
          addedAt: new Date().toISOString(),
        };
        setIngredients([fallback, ...ingredients]);
      }
    } catch {
      const fallback: FridgeIngredientItem = {
        id: `ing-${Date.now()}`,
        name: staple.name,
        category: staple.category as any,
        quantity: staple.qty,
        unit: staple.unit,
        expiryDate: expiry,
        addedAt: new Date().toISOString(),
      };
      setIngredients([fallback, ...ingredients]);
    }
    triggerNotification(`Added "${staple.name}". Tap "Find Recipes" to rescue!`);
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch("/api/fridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          quantity: parseFloat(quantity) || 1,
          unit,
          expiryDate,
        }),
      });
      const data = await res.json();
      if (data.success && data.ingredient) {
        setIngredients([data.ingredient, ...ingredients]);
      } else {
        const fallback: FridgeIngredientItem = {
          id: `ing-${Date.now()}`,
          name: name.trim(),
          category,
          quantity: parseFloat(quantity) || 1,
          unit,
          expiryDate,
          addedAt: new Date().toISOString(),
        };
        setIngredients([fallback, ...ingredients]);
      }
    } catch {
      const fallback: FridgeIngredientItem = {
        id: `ing-${Date.now()}`,
        name: name.trim(),
        category,
        quantity: parseFloat(quantity) || 1,
        unit,
        expiryDate,
        addedAt: new Date().toISOString(),
      };
      setIngredients([fallback, ...ingredients]);
    }

    setName("");
    setShowAddForm(false);
    triggerNotification(`Added "${name}" to fridge`);
  };

  const handleItemsDetected = async (items: any[]) => {
    for (const item of items) {
      try {
        const res = await fetch("/api/fridge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const data = await res.json();
        if (data.success && data.ingredient) {
          setIngredients((prev) => [data.ingredient, ...prev]);
        }
      } catch {
        // Fallback
      }
    }
    triggerNotification(`Successfully scanned & logged ${items.length} items to your fridge!`);
  };

  const handleUseIngredient = async (id: string) => {
    const item = ingredients.find((i) => i.id === id);
    setIngredients(ingredients.filter((i) => i.id !== id));
    try {
      await fetch("/api/fridge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "consume" }),
      });
    } catch {
      // Local state already updated
    }
    if (item) {
      triggerNotification(`Great job! Rescued "${item.name}" (+$3.50 saved)`);
    }
  };

  const handleDiscardIngredient = async (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
    try {
      await fetch(`/api/fridge?id=${id}`, {
        method: "DELETE",
      });
    } catch {
      // Local state already updated
    }
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
                onClick={() => setShowScannerModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition cursor-pointer shadow-xs"
              >
                <Camera className="h-4 w-4 text-emerald-200" />
                Scan Barcode / Receipt
              </button>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#333336] transition cursor-pointer"
              >
                <Plus className="h-4 w-4 text-emerald-400" />
                Manual Add
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

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Floating Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#1d1d1f] px-6 py-3.5 text-xs font-medium text-white shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Add Ingredient Form Drawer */}
        {showAddForm && (
          <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-sm animate-in fade-in duration-200">
            <h3 className="text-sm font-semibold text-[#1d1d1f] mb-4">
              Add Item to Virtual Fridge
            </h3>
            <form onSubmit={handleAddIngredient} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Ingredient name (e.g. Leftover Rice, Paneer, Spinach)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] px-3.5 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:border-[#1d1d1f] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-black/[0.1] px-3.5 py-2 text-xs text-[#1d1d1f] bg-white focus:border-[#1d1d1f] focus:outline-hidden"
                >
                  <option value="produce">Produce (Veggies & Fruits)</option>
                  <option value="dairy">Dairy & Cheese</option>
                  <option value="pantry">Pantry & Grains</option>
                  <option value="meat">Meat / Protein</option>
                  <option value="frozen">Frozen</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  placeholder="Qty"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-16 rounded-xl border border-black/[0.1] px-3 py-2 text-xs text-[#1d1d1f] focus:border-[#1d1d1f] focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="Unit (g, items, kg)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] px-3 py-2 text-xs text-[#1d1d1f] focus:border-[#1d1d1f] focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] px-3 py-2 text-xs text-[#1d1d1f] bg-white focus:border-[#1d1d1f] focus:outline-hidden"
                  required
                />
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter and stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filter === "all" ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#6e6e73]"
              }`}
            >
              All Items ({ingredients.length})
            </button>
            <button
              onClick={() => setFilter("urgent")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filter === "urgent" ? "bg-rose-700 text-white" : "bg-[#f5f5f7] text-[#6e6e73]"
              }`}
            >
              Expiring Soon ({urgentCount})
            </button>
            <button
              onClick={() => setFilter("safe")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filter === "safe" ? "bg-emerald-700 text-white" : "bg-[#f5f5f7] text-[#6e6e73]"
              }`}
            >
              Safe (4+ Days)
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

      {/* Barcode & Camera Scanner Modal */}
      <BarcodeScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onItemsDetected={handleItemsDetected}
      />
    </div>
  );
}
