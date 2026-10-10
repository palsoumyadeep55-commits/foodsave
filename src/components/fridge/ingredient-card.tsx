"use client";

import React from "react";
import { FridgeIngredientItem } from "@/types";
import { daysUntilExpiry } from "@/lib/utils";
import {
  Clock,
  Trash2,
  Check,
  Utensils,
  AlertTriangle,
} from "lucide-react";

interface IngredientCardProps {
  ingredient?: FridgeIngredientItem;
  item?: FridgeIngredientItem;
  onUse: (id: string) => void;
  onDiscard: (id: string) => void;
}

export function IngredientCard({ ingredient, item, onUse, onDiscard }: IngredientCardProps) {
  const ing = ingredient || item;
  if (!ing) return null;

  const daysLeft = daysUntilExpiry(ing.expiryDate);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "produce":
        return "🥦";
      case "dairy":
        return "🧀";
      case "meat":
        return "🥩";
      case "pantry":
        return "🍚";
      case "frozen":
        return "❄️";
      default:
        return "🍽️";
    }
  };

  const isExpired = daysLeft < 0;
  const isUrgent = daysLeft >= 0 && daysLeft <= 2;
  const isWarning = daysLeft > 2 && daysLeft <= 4;

  const badgeColor = isExpired
    ? "bg-rose-100 text-rose-800 border-rose-300"
    : isUrgent
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : isWarning
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-emerald-50 text-emerald-800 border-emerald-200";

  return (
    <div className="flex items-center justify-between gap-3 rounded-[22px] border border-black/[0.08] bg-white p-4 shadow-xs hover:border-black/[0.16] hover:shadow-md transition">
      {/* Left Icon & Details */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f5f7] text-2xl shrink-0">
          {getCategoryIcon(ing.category)}
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-[#1d1d1f] truncate">
            {ing.name}
          </h4>
          <p className="text-xs text-[#6e6e73] truncate">
            {ing.quantity} {ing.unit} •{" "}
            <span className="capitalize">{ing.category}</span>
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeColor}`}
            >
              <Clock className="h-3 w-3" />
              {isExpired
                ? `Expired ${Math.abs(daysLeft)}d ago`
                : daysLeft === 0
                ? "Expires Today!"
                : `${daysLeft} days left`}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onUse(ing.id)}
          title="Mark as Cooked / Used"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white transition cursor-pointer"
        >
          <Check className="h-4 w-4" />
        </button>

        <button
          onClick={() => onDiscard(ing.id)}
          title="Remove item"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f7] text-[#86868b] hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
