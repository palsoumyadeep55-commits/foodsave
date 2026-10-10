"use client";

import React, { useState } from "react";
import { RecipeSuggestion } from "@/types";
import {
  Clock,
  Users,
  ChefHat,
  Check,
  Bookmark,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Leaf,
  DollarSign,
  Globe2,
  Lightbulb,
} from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeSuggestion;
  onCookRecipe?: (recipe: RecipeSuggestion) => void;
}

export function RecipeCard({ recipe, onCookRecipe }: RecipeCardProps) {
  const [saved, setSaved] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden rounded-[24px] border border-black/[0.08] bg-white shadow-xs transition hover:shadow-md hover:border-black/[0.15]">
      {/* Recipe Photo */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-[#1d1d1f]/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white shadow-xs">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            Rescues {recipe.usedIngredients.length} Items
          </span>
          {recipe.dietaryTag && (
            <span className="rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-[#1d1d1f] shadow-xs">
              {recipe.dietaryTag}
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={() => setSaved(!saved)}
          className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer ${
            saved ? "bg-emerald-600 text-white" : "bg-white/90 text-zinc-700 hover:bg-white"
          }`}
          title="Save Recipe"
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-white" : ""}`} />
        </button>

        {/* Bottom Bar: Cuisine & Origin */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white">
            <Globe2 className="h-3 w-3 text-emerald-400" />
            {recipe.countryOrigin ? `${recipe.countryOrigin} • ` : ""}
            {recipe.cuisine || "Global Zero-Waste"}
          </span>

          {recipe.carbonSavedKg && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
              <Leaf className="h-3 w-3" />
              -{recipe.carbonSavedKg}kg CO₂e
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-base font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-snug">
          {recipe.title}
        </h3>

        <div className="mt-2.5 flex items-center gap-4 text-xs font-medium text-[#6e6e73]">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            {recipe.cookingTimeMinutes} mins
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-[#86868b]" />
            {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="h-3.5 w-3.5 text-[#86868b]" />
            {recipe.difficulty}
          </span>
          {recipe.calories && (
            <span className="text-[#86868b]">
              ~{recipe.calories} kcal
            </span>
          )}
        </div>

        {/* Used vs Missing Ingredients */}
        <div className="mt-4 space-y-2 border-t border-black/[0.06] pt-3.5 text-xs">
          <div>
            <span className="font-semibold text-emerald-800 text-[11px] uppercase tracking-wider">
              From your fridge:
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {recipe.usedIngredients.map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200/80"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {recipe.missedIngredients.length > 0 && (
            <div>
              <span className="font-semibold text-[#86868b] text-[11px] uppercase tracking-wider">
                Pantry essentials needed:
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {recipe.missedIngredients.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-[#f5f5f7] px-2 py-0.5 text-[11px] text-[#6e6e73]"
                  >
                    + {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zero waste culinary tip */}
        {recipe.zeroWasteTip && (
          <div className="mt-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 p-2.5 flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed">
            <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero-Waste Secret:</strong> {recipe.zeroWasteTip}
            </span>
          </div>
        )}

        <p className="mt-3 text-xs text-[#6e6e73] leading-relaxed">
          {recipe.instructionsSummary}
        </p>

        {/* Expandable Step-by-Step Instructions */}
        {recipe.stepByStep && recipe.stepByStep.length > 0 && (
          <div className="mt-3 pt-2">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="flex items-center justify-between w-full text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition py-1 cursor-pointer"
            >
              <span>{showSteps ? "Hide Preparation Steps" : "View Step-by-Step Cooking Guide"}</span>
              {showSteps ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showSteps && (
              <ol className="mt-2.5 space-y-2 border-l-2 border-emerald-300 pl-3 text-[11px] text-[#1d1d1f] leading-relaxed">
                {recipe.stepByStep.map((step, idx) => (
                  <li key={idx} className="relative">
                    <span className="font-bold text-emerald-700 mr-1.5">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* Cook & rescue CTA */}
        <div className="mt-auto pt-4 border-t border-black/[0.06] flex items-center gap-2">
          <button
            onClick={() => onCookRecipe?.(recipe)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#1d1d1f] py-2.5 px-4 text-xs font-medium text-white hover:bg-[#333336] transition cursor-pointer"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            Cook & Log Food Rescued
          </button>
        </div>
      </div>
    </div>
  );
}
