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
  Bot,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>(mockRecipes);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All Cuisines");
  const [selectedDiet, setSelectedDiet] = useState<string>("All Diets");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cookingNotification, setCookingNotification] = useState<string | null>(null);

  // AI generator state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customIngredientsInput, setCustomIngredientsInput] = useState<string>("");
  const [aiMessage, setAiMessage] = useState<string | null>(null);

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

  const handleGenerateAiRecipes = async () => {
    setIsGenerating(true);
    setAiMessage(null);
    try {
      const payload: any = {};
      if (customIngredientsInput.trim()) {
        payload.ingredients = customIngredientsInput
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      }

      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.recipes && data.recipes.length > 0) {
        // Prepend AI recipes
        setRecipes([...data.recipes, ...recipes]);
        setAiMessage(
          `✨ Generated ${data.recipes.length} custom zero-waste recipes using ingredients expiring soon!`
        );
      } else {
        setAiMessage("Could not generate recipes right now. Try specifying ingredients.");
      }
    } catch {
      setAiMessage("Recipe generation failed. Check your network or API keys.");
    } finally {
      setIsGenerating(false);
    }
  };

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
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-7 sm:p-10 shadow-xs space-y-6">
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

          {/* AI Recipe Generator Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                <Bot className="h-4 w-4" />
                <span>AI Zero-Waste Culinary Engine</span>
              </div>
              <h3 className="text-lg font-bold text-white">Generate Custom Recipes From Your Fridge</h3>
              <p className="text-xs text-emerald-100">
                Instantly analyzes the exact expiring produce, rice, or dairy in your virtual fridge to synthesize zero-waste chef instructions.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                placeholder="Optional: e.g. stale bread, ripe tomatoes"
                value={customIngredientsInput}
                onChange={(e) => setCustomIngredientsInput(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-full bg-white/10 text-white placeholder:text-emerald-200 border border-white/20 focus:bg-white/20 focus:outline-hidden"
              />
              <button
                disabled={isGenerating}
                onClick={handleGenerateAiRecipes}
                className="px-5 py-2.5 rounded-full bg-emerald-400 text-emerald-950 font-semibold text-xs hover:bg-emerald-300 transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing ingredients...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate With AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {aiMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{aiMessage}</span>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="pt-2 border-t border-black/[0.06] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipe name, country (e.g. Italy, India, Mexico), or ingredient (rice, spinach)..."
                className="w-full rounded-full border border-black/[0.08] bg-[#f5f5f7] pl-10 pr-4 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:border-[#1d1d1f] focus:bg-white focus:outline-hidden transition"
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

          {/* Cuisine Pill Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCuisine === cuisine
                    ? "bg-[#1d1d1f] text-white shadow-2xs"
                    : "bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.06]"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Cards Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[#6e6e73]">
              Showing {filteredRecipes.length} of {recipes.length} culinary rescue solutions
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Zero-waste certified
            </span>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onCookRecipe={handleCook}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-black/[0.08] bg-white p-12 text-center">
              <ChefHat className="h-10 w-10 text-[#86868b] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                No matching recipes found
              </h3>
              <p className="mt-1 text-xs text-[#6e6e73]">
                Try selecting "All Cuisines" or tap "Generate With AI" to create a bespoke recipe!
              </p>
              <button
                onClick={() => {
                  setSelectedCuisine("All Cuisines");
                  setSelectedDiet("All Diets");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#1d1d1f] px-5 py-2 text-xs font-semibold text-white hover:bg-[#333336] transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
