"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockRecipes } from "@/lib/mock-data";
import { RecipeSuggestion } from "@/types";
import { RecipeCard } from "@/components/fridge/recipe-card";
import {
  ArrowLeft,
  ChefHat,
  Sparkles,
  CheckCircle2,
  Globe2,
  Search,
  Filter,
  Flame,
  Leaf,
} from "lucide-react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>(mockRecipes);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All Cuisines");
  const [selectedDiet, setSelectedDiet] = useState<string>("All Diets");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cookingNotification, setCookingNotification] = useState<string | null>(null);

  const cuisines = [
    "All Cuisines",
    "South Asian",
    "East Asian",
    "Southeast Asian",
    "Mediterranean",
    "European",
    "Middle Eastern",
    "Latin American",
    "North American",
    "African",
    "Global Zero-Waste",
  ];

  const diets = ["All Diets", "Vegetarian", "Vegan"];

  const filteredRecipes = recipes.filter((r) => {
    const matchesCuisine =
      selectedCuisine === "All Cuisines" || r.cuisine === selectedCuisine;

    const matchesDiet =
      selectedDiet === "All Diets" || r.dietaryTag === selectedDiet;

    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.instructionsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.countryOrigin && r.countryOrigin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.usedIngredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCuisine && matchesDiet && matchesSearch;
  });

  const handleCook = (recipe: RecipeSuggestion) => {
    const savings = recipe.moneySavedUsd ? `$${recipe.moneySavedUsd.toFixed(2)}` : "₹280";
    setCookingNotification(
      `Rescued with "${recipe.title}"! Avoided ${recipe.carbonSavedKg || 1.2}kg CO₂e and saved ${savings}.`
    );
    setTimeout(() => setCookingNotification(null), 4500);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/fridge"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fridge Inventory
        </Link>

        {/* Floating Success Alert */}
        {cookingNotification && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#1d1d1f] px-6 py-3.5 text-xs font-medium text-white shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{cookingNotification}</span>
          </div>
        )}

        {/* Hero Header */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-7 sm:p-10 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-[0.04em]">
                <Globe2 className="h-4 w-4" />
                <span>Worldwide Smart Culinary Rescue</span>
              </div>
              <h1 className="mt-1.5 text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.035em]">
                Smart Recipes For Expiring Groceries
              </h1>
              <p className="mt-2 text-sm text-[#6e6e73] leading-relaxed">
                Transform day-old rice, stale breads, softening tomatoes, and wilted greens into 22+
                masterpiece dishes from Asia, the Mediterranean, the Americas, Europe, and Africa.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 bg-[#f5f5f7] rounded-2xl p-4 border border-black/[0.04]">
              <div className="text-center px-3">
                <span className="block text-2xl font-bold tracking-tight text-[#1d1d1f]">
                  {recipes.length}
                </span>
                <span className="text-[11px] font-medium text-[#6e6e73]">
                  World Recipes
                </span>
              </div>
              <div className="h-8 w-px bg-black/[0.08]" />
              <div className="text-center px-3">
                <span className="block text-2xl font-bold tracking-tight text-emerald-700">
                  100%
                </span>
                <span className="text-[11px] font-medium text-[#6e6e73]">
                  Secular & Pure
                </span>
              </div>
              <div className="h-8 w-px bg-black/[0.08]" />
              <div className="text-center px-3">
                <span className="block text-2xl font-bold tracking-tight text-[#1d1d1f]">
                  6
                </span>
                <span className="text-[11px] font-medium text-[#6e6e73]">
                  Continents
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipe name, country (e.g. Italy, India, Mexico), or ingredient (rice, spinach)..."
                className="w-full rounded-full border border-black/[0.08] bg-[#f5f5f7] pl-10 pr-4 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:border-[#1d1d1f] focus:bg-white focus:outline-none transition"
              />
            </div>

            {/* Diet Filter Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {diets.map((diet) => (
                <button
                  key={diet}
                  onClick={() => setSelectedDiet(diet)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                    selectedDiet === diet
                      ? "bg-[#1d1d1f] text-white"
                      : "bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.06]"
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisines Scroll/Wrap */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  selectedCuisine === c
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.06]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between text-xs font-medium text-[#6e6e73] px-2">
          <span>
            Showing <strong>{filteredRecipes.length}</strong> smart rescue recipes
            {selectedCuisine !== "All Cuisines" ? ` in ${selectedCuisine}` : ""}
            {selectedDiet !== "All Diets" ? ` (${selectedDiet})` : ""}
          </span>
          {(selectedCuisine !== "All Cuisines" || selectedDiet !== "All Diets" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCuisine("All Cuisines");
                setSelectedDiet("All Diets");
                setSearchQuery("");
              }}
              className="text-emerald-700 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onCookRecipe={handleCook} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[24px] border border-dashed border-black/[0.12] bg-white p-12 text-center max-w-md mx-auto">
            <ChefHat className="mx-auto h-10 w-10 text-[#86868b]" />
            <h3 className="mt-3 text-base font-semibold text-[#1d1d1f]">
              No recipes match your criteria
            </h3>
            <p className="mt-1.5 text-xs text-[#6e6e73]">
              Try clearing your search query or choosing another world cuisine tradition.
            </p>
            <button
              onClick={() => {
                setSelectedCuisine("All Cuisines");
                setSelectedDiet("All Diets");
                setSearchQuery("");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#1d1d1f] px-5 py-2 text-xs font-medium text-white hover:bg-[#333336] transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
