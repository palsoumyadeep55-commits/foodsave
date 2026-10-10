"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLocation, KNOWN_HUBS, KnownHub } from "@/context/location-context";
import { WORLD_COUNTRIES, CountryInfo } from "@/lib/countries";
import { mockCommunityFridges, initialListings, mockRecipes } from "@/lib/mock-data";
import { calculateDistanceKm } from "@/lib/utils";
import {
  MapPin,
  Compass,
  Navigation,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Search,
  Globe2,
  Loader2,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";

interface SuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  city: string;
  country: string;
  flag: string;
  type: "hub" | "country";
}

export function LocalHubSection() {
  const {
    location,
    setLocationByCity,
    detectBrowserLocation,
    isDetecting,
    statusMessage,
  } = useLocation();

  const [inputQuery, setInputQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Compute live predictive suggestions
  const suggestions = useMemo<SuggestionItem[]>(() => {
    const q = inputQuery.trim().toLowerCase();
    if (!q) return [];

    const items: SuggestionItem[] = [];

    // 1. Search Known Hubs
    for (const hub of KNOWN_HUBS) {
      const matchCity = hub.city.toLowerCase().includes(q);
      const matchCountry = hub.country.toLowerCase().includes(q);
      const matchAlias = hub.aliases.some((a) => a.includes(q) || q.includes(a));

      if (matchCity || matchCountry || matchAlias) {
        const countryData = WORLD_COUNTRIES.find((c) => c.code === hub.countryCode);
        items.push({
          id: `hub-${hub.city}`,
          title: `${hub.city}, ${hub.country}`,
          subtitle: `Active Hub • Local Fridge & Surplus Matcher (${hub.currencySymbol})`,
          city: hub.city,
          country: hub.country,
          flag: countryData?.flag || "🌍",
          type: "hub",
        });
      }
      if (items.length >= 6) break;
    }

    // 2. Search World Countries if needed
    if (items.length < 6) {
      for (const country of WORLD_COUNTRIES) {
        const matchCountryName = country.name.toLowerCase().includes(q);
        const matchHubName = country.majorHubs.some((h) => h.toLowerCase().includes(q));

        if (matchCountryName || matchHubName) {
          const matchedHub =
            country.majorHubs.find((h) => h.toLowerCase().includes(q)) || country.majorHubs[0];

          // Check if not already included
          if (!items.some((i) => i.city.toLowerCase() === matchedHub.toLowerCase())) {
            items.push({
              id: `country-${country.code}-${matchedHub}`,
              title: `${matchedHub}, ${country.name}`,
              subtitle: `Major City • ${country.continent} • Currency: ${country.currencySymbol}`,
              city: matchedHub,
              country: country.name,
              flag: country.flag,
              type: "country",
            });
          }
        }
        if (items.length >= 6) break;
      }
    }

    return items;
  }, [inputQuery]);

  const handleSelectSuggestion = (suggestedCity: string) => {
    setLocationByCity(suggestedCity);
    setInputQuery("");
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    const success = setLocationByCity(inputQuery);
    if (success) {
      setInputQuery("");
      setShowDropdown(false);
    }
  };

  // 1. Find the nearest community fridge with accurate geographic distance & priority
  const nearestFridge = useMemo(() => {
    // Priority 1: Exact city match
    const exactCityFridge = mockCommunityFridges.find(
      (f) => f.city.toLowerCase() === location.city.toLowerCase()
    );

    if (exactCityFridge) {
      // If user has coordinates and fridge has coordinates, compute real distance
      if (location.latitude && location.longitude && exactCityFridge.latitude && exactCityFridge.longitude) {
        const dist = calculateDistanceKm(
          location.latitude,
          location.longitude,
          exactCityFridge.latitude,
          exactCityFridge.longitude
        );
        return {
          ...exactCityFridge,
          distanceKm: Number(dist.toFixed(1)),
        };
      }
      return {
        ...exactCityFridge,
        distanceKm: 0.8,
      };
    }

    // Priority 2: Geographic nearest fridge using coordinates
    if (location.latitude && location.longitude) {
      let closest = mockCommunityFridges[0];
      let minKm = Infinity;
      for (const f of mockCommunityFridges) {
        const d = calculateDistanceKm(
          location.latitude,
          location.longitude,
          f.latitude,
          f.longitude
        );
        if (d < minKm) {
          minKm = d;
          closest = f;
        }
      }
      return {
        ...closest,
        distanceKm: Number(minKm.toFixed(1)),
      };
    }

    // Priority 3: Same country fridge
    const sameCountryFridge = mockCommunityFridges.find(
      (f) => f.country.toLowerCase() === location.country.toLowerCase()
    );
    if (sameCountryFridge) {
      return {
        ...sameCountryFridge,
        distanceKm: 3.5,
      };
    }

    // Fallback: Default hub
    return {
      ...mockCommunityFridges[0],
      distanceKm: 1.2,
    };
  }, [location]);

  // 2. Find nearest surplus food matcher listings in their specific city or country
  const localListings = useMemo(() => {
    // 1. Exact city matches first
    const cityMatches = initialListings.filter(
      (l) => l.donorCity && l.donorCity.toLowerCase() === location.city.toLowerCase()
    );
    if (cityMatches.length > 0) return cityMatches.slice(0, 2);

    // 2. Same country matches
    const countryMatches = initialListings.filter(
      (l) => l.donorCountry && l.donorCountry.toLowerCase() === location.country.toLowerCase()
    );
    if (countryMatches.length > 0) return countryMatches.slice(0, 2);

    // 3. Global active listings with user's preferred currency
    return initialListings.slice(0, 2).map((item) => ({
      ...item,
      currencySymbol: location.currencySymbol,
    }));
  }, [location]);

  // Source badge label and style
  const sourceBadge = useMemo(() => {
    switch (location.source) {
      case "gps":
        return {
          label: "🛰️ High-Precision GPS",
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "ip":
        return {
          label: "🌐 Network Auto-Detected",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "timezone":
        return {
          label: "📍 Timezone Detected",
          className: "bg-amber-100 text-amber-800 border-amber-200",
        };
      default:
        return {
          label: "📍 Selected Hub",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  }, [location.source]);

  return (
    <section className="relative -mt-8 mb-16 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Floating Glass Detector Card */}
        <div className="rounded-[30px] border border-black/[0.08] bg-white/95 p-6 sm:p-9 shadow-xl shadow-black/5 backdrop-blur-xl">
          {/* Top Detector Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-black/[0.06]">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-[0.04em]">
                <Compass className="h-4 w-4" />
                <span>Hyper-Local Zero Waste Detection</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${sourceBadge.className}`}>
                  {sourceBadge.label}
                </span>
              </div>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-[-0.03em]">
                Explore Resources In{" "}
                <span className="text-emerald-800 underline decoration-emerald-300 decoration-wavy underline-offset-4">
                  {location.city}, {location.country}
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#6e6e73] leading-relaxed">
                Auto-detect your real-time location or type any city to view local community fridges, commercial surplus donations,
                and regional zero-waste recipes.
              </p>
            </div>

            {/* Geolocation Detect & Predictive Search Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {/* GPS Auto Detect Button */}
              <button
                onClick={() => detectBrowserLocation()}
                disabled={isDetecting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition cursor-pointer disabled:opacity-60"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 text-emerald-300" />
                    <span>Detect My Location</span>
                  </>
                )}
              </button>

              {/* Autocomplete City & Country Search */}
              <div ref={dropdownRef} className="relative flex-1 sm:w-72">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
                  <input
                    type="text"
                    placeholder="Search city, e.g. Kolkata, London..."
                    value={inputQuery}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                      setInputQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    className="w-full rounded-full border border-black/[0.1] bg-[#f5f5f7] pl-10 pr-9 py-2.5 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:border-[#1d1d1f] focus:bg-white focus:outline-none transition shadow-2xs"
                  />
                  {inputQuery && (
                    <button
                      type="button"
                      onClick={() => setInputQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </form>

                {/* Dropdown Suggestions */}
                {showDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-black/[0.08] bg-white p-2 shadow-2xl shadow-black/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-1">
                    {/* Fast Auto-Detect Item */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        detectBrowserLocation();
                      }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-emerald-800 hover:bg-emerald-50 transition cursor-pointer border-b border-black/[0.04] mb-1"
                    >
                      <Navigation className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-semibold">Use Current Location</div>
                        <div className="text-[10px] text-emerald-600/80">GPS & Network Auto-Detection</div>
                      </div>
                    </button>

                    {/* Filtered Hubs / Cities */}
                    {suggestions.length > 0 ? (
                      <div className="space-y-0.5 max-h-60 overflow-y-auto">
                        {suggestions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectSuggestion(item.city)}
                            className="w-full flex items-start gap-2.5 rounded-xl px-3 py-2 text-left text-xs hover:bg-[#f5f5f7] transition cursor-pointer"
                          >
                            <span className="text-base shrink-0 leading-none mt-0.5">{item.flag}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-[#1d1d1f] truncate">{item.title}</div>
                              <div className="text-[11px] text-[#86868b] truncate">{item.subtitle}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : inputQuery.trim() ? (
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(inputQuery)}
                        className="w-full rounded-xl px-3 py-2 text-left text-xs text-[#6e6e73] hover:bg-[#f5f5f7] transition"
                      >
                        Set location to <strong className="text-[#1d1d1f]">"{inputQuery}"</strong>
                      </button>
                    ) : (
                      <div className="px-3 py-2 text-[11px] text-[#86868b]">
                        Type any city, state, or country name to view local resources.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Hub Chips */}
          <div className="py-3.5 border-b border-black/[0.06] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider shrink-0">
              Quick Hubs:
            </span>
            {KNOWN_HUBS.slice(0, 10).map((hub) => (
              <button
                key={hub.city}
                onClick={() => setLocationByCity(hub.city)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer shrink-0 ${
                  location.city.toLowerCase() === hub.city.toLowerCase()
                    ? "bg-[#1d1d1f] text-white shadow-xs"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.06]"
                }`}
              >
                {hub.city}, {hub.country}
              </button>
            ))}
          </div>

          {/* Status Message Notification banner */}
          {statusMessage && (
            <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200/60 px-4 py-2 text-xs font-medium text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Personalized Local Resource Cards Grid */}
          <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 1. Nearest Community Fridge */}
            <div className="lg:col-span-5 rounded-[24px] border border-black/[0.08] bg-[#fbfbfd] p-6 flex flex-col justify-between shadow-2xs hover:shadow-xs transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                    <MapPin className="h-3 w-3 text-emerald-700" />
                    Nearest Community Fridge • {nearestFridge.distanceKm < 1 ? `${Math.round(nearestFridge.distanceKm * 1000)} m away` : `${nearestFridge.distanceKm} km away`}
                  </span>
                  <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {nearestFridge.inventoryLevel}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#1d1d1f] tracking-tight">
                  {nearestFridge.name}
                </h3>
                <p className="mt-1 text-xs text-[#6e6e73] leading-relaxed">
                  {nearestFridge.address} • {nearestFridge.city}, {nearestFridge.country}
                </p>

                {/* Operating hours & Urgent Needs */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#6e6e73]">
                    <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{nearestFridge.operatingHours}</span>
                  </div>

                  {nearestFridge.urgentlyNeeded && nearestFridge.urgentlyNeeded.length > 0 && (
                    <div className="rounded-xl bg-rose-50 border border-rose-200/80 p-2.5 flex items-start gap-2 text-[11px] text-rose-900">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Urgently Needed:</strong> {nearestFridge.urgentlyNeeded[0].item}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-[#86868b]">
                  100% Free Mutual Aid Pantry
                </span>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1d1d1f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#333336] transition cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5 text-emerald-400" />
                  <span>View on Map</span>
                </Link>
              </div>
            </div>

            {/* 2. Nearest Surplus Food Matcher in their Area */}
            <div className="lg:col-span-4 rounded-[24px] border border-black/[0.08] bg-[#fbfbfd] p-6 flex flex-col justify-between shadow-2xs hover:shadow-xs transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                    <ShoppingBag className="h-3 w-3" />
                    Surplus Matcher in {location.city}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {localListings[0].price === 0 ? "100% FREE" : `${location.currencySymbol}${localListings[0].price}`}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight line-clamp-1">
                  {localListings[0].title}
                </h3>
                <p className="mt-1 text-xs text-[#6e6e73] line-clamp-2 leading-relaxed">
                  {localListings[0].description}
                </p>

                <div className="mt-3.5 flex items-center gap-2 text-xs text-[#86868b]">
                  <span>From: <strong className="text-[#1d1d1f]">{localListings[0].donorName}</strong></span>
                  <span>•</span>
                  <span>{localListings[0].quantity}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-[#86868b]">
                  Pickup: {localListings[0].pickupStartTime} - {localListings[0].pickupEndTime}
                </span>
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.1] bg-white px-4 py-2 text-xs font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7] transition"
                >
                  <span>Claim Surplus</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Regional Climate & Savings Potential */}
            <div className="lg:col-span-3 rounded-[24px] border border-black/[0.08] bg-[#fbfbfd] p-6 flex flex-col justify-between shadow-2xs hover:shadow-xs transition">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-teal-900 mb-2">
                  <Leaf className="h-3 w-3" />
                  Your Regional Potential
                </span>

                <div className="mt-1">
                  <span className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                    {location.currencySymbol}
                    {location.countryCode === "IN" ? "3,500" : location.countryCode === "JP" ? "14,000" : "125"}
                  </span>
                  <span className="text-xs text-[#6e6e73] block">
                    Estimated monthly household food savings
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-black/[0.06] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span>Landfill Methane Saved:</span>
                    <strong className="text-emerald-800">~18.5 kg CO₂e</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#6e6e73]">
                    <span>Regional Currency:</span>
                    <strong className="text-[#1d1d1f]">{location.currencyCode} ({location.currencySymbol})</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.06]">
                <Link
                  href="/calculator"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
                >
                  <span>Open Carbon & Cost Auditor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
