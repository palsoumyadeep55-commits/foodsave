"use client";

import React, { useState } from "react";
import { FoodListingItem } from "@/types";
import {
  Clock,
  MapPin,
  Package,
  Building2,
  Sparkles,
  Users,
} from "lucide-react";

interface ListingCardProps {
  listing: FoodListingItem;
  onClaim: (listing: FoodListingItem) => void;
}

export function ListingCard({ listing, onClaim }: ListingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isFree = listing.price === 0;
  const currency = listing.currencySymbol || "$";

  // Calculate hours remaining until expiry
  const expiryDate = new Date(listing.expiryTime);
  const hoursLeft = Math.max(
    0,
    Math.round((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60))
  );

  const urgencyColor =
    hoursLeft <= 2
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : hoursLeft <= 5
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="group flex flex-col overflow-hidden rounded-[22px] border border-black/[0.08] bg-white shadow-xs transition duration-200 hover:shadow-xl hover:shadow-black/5 hover:border-black/[0.16]">
      {/* Photo banner */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-90"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-600">
            <Package className="h-12 w-12" />
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute top-3 right-3">
          {isFree ? (
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
              100% FREE
            </span>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-[#1d1d1f]/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
              <span>{currency}{listing.price.toFixed(2)}</span>
              {listing.originalPrice && (
                <span className="text-zinc-400 line-through text-[10px]">
                  {currency}{listing.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bulk Event / Mandi Tag */}
        {listing.isBulkEventSurplus && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-amber-500/95 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs flex items-center gap-1">
              <Users className="h-3 w-3" />
              Bulk Event Lot
            </span>
          </div>
        )}

        {/* Urgency Pill */}
        <div className="absolute bottom-3 left-3">
          <div
            className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-md ${urgencyColor}`}
          >
            <Clock className="h-3 w-3" />
            <span>Expires in {hoursLeft}h</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Dietary Tags */}
        {listing.dietaryTags && listing.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {listing.dietaryTags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                  tag === "Vegetarian"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                    : tag === "Vegan"
                    ? "bg-green-50 text-green-800 border border-green-300"
                    : "bg-amber-50 text-amber-800 border border-amber-300"
                }`}
              >
                {tag === "Vegetarian" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />}
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight line-clamp-1 group-hover:text-emerald-700 transition">
          {listing.title}
        </h3>
        <p className="mt-1 text-xs text-[#6e6e73] line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        {/* Donor & Details */}
        <div className="mt-4 space-y-2 text-xs text-[#6e6e73] border-t border-black/[0.06] pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-[#1d1d1f]">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{listing.donorName}</span>
            </div>
            <span className="text-[11px] text-[#86868b] font-medium">
              {listing.donorCity ? `${listing.donorCity}${listing.donorCountry ? `, ${listing.donorCountry}` : ""} • ` : ""}{listing.distanceKm} km away
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#6e6e73]">
            <Package className="h-3.5 w-3.5 text-zinc-400" />
            <span>Quantity: <strong className="text-[#1d1d1f]">{listing.quantity}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-[#6e6e73]">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span>Pickup: {listing.pickupStartTime} - {listing.pickupEndTime}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#6e6e73]">
            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
            <span className="truncate">{listing.donorAddress}</span>
          </div>
        </div>

        {/* Claim Action */}
        <div className="mt-5 pt-3 border-t border-black/[0.06]">
          <button
            onClick={() => onClaim(listing)}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-700 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 active:scale-[0.99] transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Claim This Surplus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
