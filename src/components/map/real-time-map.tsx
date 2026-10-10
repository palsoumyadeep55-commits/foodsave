"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CommunityLocationItem, FoodListingItem } from "@/types";
import {
  MapPin,
  Navigation,
  Globe2,
  Loader2,
  Layers,
  Maximize2,
  Compass,
} from "lucide-react";

// Dynamically import LeafletMapInner with SSR disabled
const LeafletMapInner = dynamic(() => import("./leaflet-map-inner"), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

function MapLoadingSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#f0f0f2] text-[#86868b] animate-pulse">
      <div className="flex items-center gap-2 text-xs font-medium">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
        <span>Loading Live Real-Time Cartography...</span>
      </div>
      <span className="text-[10px] text-[#86868b] mt-1">OpenStreetMap Street Grid Engine</span>
    </div>
  );
}

interface RealTimeMapProps {
  center: [number, number];
  zoom?: number;
  userLocation: {
    latitude: number;
    longitude: number;
    city: string;
    neighborhood?: string;
    displayName?: string;
    accuracy?: number;
  } | null;
  fridges: CommunityLocationItem[];
  listings: FoodListingItem[];
  selectedItem: {
    id: string;
    type: "fridge" | "listing";
    lat: number;
    lng: number;
    title: string;
    address: string;
    city: string;
    country: string;
  } | null;
  onSelectFridge: (item: CommunityLocationItem) => void;
  onSelectListing: (item: FoodListingItem) => void;
  onRecenterUser?: () => void;
  isTrackingLive?: boolean;
  className?: string;
}

export function RealTimeMap({
  center,
  zoom = 14,
  userLocation,
  fridges,
  listings,
  selectedItem,
  onSelectFridge,
  onSelectListing,
  onRecenterUser,
  isTrackingLive = false,
  className = "h-80 sm:h-96",
}: RealTimeMapProps) {
  const [mapMode, setMapMode] = useState<"interactive" | "street">("interactive");

  const currentLat = selectedItem?.lat ?? center[0] ?? 22.5726;
  const currentLng = selectedItem?.lng ?? center[1] ?? 88.3639;

  return (
    <div
      className={`relative w-full rounded-[28px] overflow-hidden border border-black/[0.08] shadow-sm bg-[#e5e5ea] ${className}`}
    >
      {mapMode === "interactive" ? (
        <LeafletMapInner
          center={[currentLat, currentLng]}
          zoom={zoom}
          userLocation={userLocation}
          fridges={fridges}
          listings={listings}
          selectedItem={selectedItem}
          onSelectFridge={onSelectFridge}
          onSelectListing={onSelectListing}
          onRecenterUser={onRecenterUser}
          isTrackingLive={isTrackingLive}
        />
      ) : (
        /* Real-Time OpenStreetMap Live Tile Embed */
        <iframe
          title="Real Time Street Map"
          width="100%"
          height="100%"
          className="border-0 w-full h-full"
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLng - 0.02}%2C${currentLat - 0.015}%2C${currentLng + 0.02}%2C${currentLat + 0.015}&layer=mapnik&marker=${currentLat}%2C${currentLng}`}
        />
      )}

      {/* Top Left: Active Location & Precision Badge */}
      <div className="absolute top-4 left-4 z-[400] max-w-[70%] rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-[#1d1d1f] shadow-xs flex items-center gap-2 border border-black/[0.06]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <span className="truncate">
          {selectedItem
            ? `${selectedItem.title} • ${selectedItem.city}`
            : userLocation
            ? `📍 ${userLocation.displayName || userLocation.city}${userLocation.accuracy ? ` (±${Math.round(userLocation.accuracy)}m)` : ""}`
            : "Real-Time Civic Map"}
        </span>
      </div>

      {/* Top Right: Mode Switcher */}
      <div className="absolute top-4 right-16 z-[400] hidden sm:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-black/[0.08] text-[11px] font-medium shadow-xs">
        <button
          type="button"
          onClick={() => setMapMode("interactive")}
          className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
            mapMode === "interactive"
              ? "bg-[#1d1d1f] text-white"
              : "text-[#6e6e73] hover:text-[#1d1d1f]"
          }`}
        >
          Interactive
        </button>
        <button
          type="button"
          onClick={() => setMapMode("street")}
          className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
            mapMode === "street"
              ? "bg-[#1d1d1f] text-white"
              : "text-[#6e6e73] hover:text-[#1d1d1f]"
          }`}
        >
          Street View
        </button>
      </div>

      {/* Bottom Left: Visual Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/[0.08] text-[11px] font-medium text-[#1d1d1f] shadow-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#047857]" />
          <span>Fridges ({fridges.length})</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
          <span>Surplus ({listings.length})</span>
        </span>
        {userLocation && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
            <span>You {userLocation.accuracy ? `(±${Math.round(userLocation.accuracy)}m)` : ""}</span>
          </span>
        )}
      </div>

      {/* Bottom Right: Open in External Navigation App */}
      <div className="absolute bottom-4 right-4 z-[400]">
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            selectedItem ? `${selectedItem.lat},${selectedItem.lng}` : `${currentLat},${currentLng}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-[#1d1d1f] shadow-xs border border-black/[0.08] hover:bg-white transition"
        >
          <Navigation className="h-3 w-3 text-emerald-600" />
          <span className="hidden sm:inline">Directions</span>
        </a>
      </div>
    </div>
  );
}
