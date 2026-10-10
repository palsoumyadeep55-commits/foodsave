"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLocation } from "@/context/location-context";
import { mockCommunityFridges, initialListings } from "@/lib/mock-data";
import { CommunityLocationItem, FoodListingItem } from "@/types";
import { RealTimeMap } from "@/components/map/real-time-map";
import { AddLocationModal } from "@/components/map/add-location-modal";
import { CONTINENTS } from "@/lib/countries";
import { calculateDistanceKm } from "@/lib/utils";
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Navigation,
  Globe2,
  ShoppingBag,
  ArrowRight,
  Layers,
  Sparkles,
  Loader2,
  Leaf,
  Compass,
} from "lucide-react";

type MapResourceItem =
  | { kind: "fridge"; data: CommunityLocationItem; distanceKm: number }
  | { kind: "listing"; data: FoodListingItem; distanceKm: number };

export default function CommunityMapPage() {
  const {
    location: userLoc,
    setLocationByCity,
    detectBrowserLocation,
    isDetecting,
    statusMessage,
    isLiveTracking,
    toggleLiveTracking,
  } = useLocation();

  const [fridgesList, setFridgesList] = useState<CommunityLocationItem[]>(mockCommunityFridges);
  const [listingsList, setListingsList] = useState<FoodListingItem[]>(initialListings);

  // Active filter tab
  const [filterTab, setFilterTab] = useState<"all" | "fridges" | "surplus" | "kitchens">("all");
  const [selectedContinent, setSelectedContinent] = useState<string>("All Continents");
  const [selectedCountry, setSelectedCountry] = useState<string>("All Countries");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropOffNotification, setDropOffNotification] = useState<string | null>(null);

  // Active selected item on the map & detail card
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    type: "fridge" | "listing";
    lat: number;
    lng: number;
    title: string;
    address: string;
    city: string;
    country: string;
  }>({
    id: mockCommunityFridges[0].id,
    type: "fridge",
    lat: mockCommunityFridges[0].latitude,
    lng: mockCommunityFridges[0].longitude,
    title: mockCommunityFridges[0].name,
    address: mockCommunityFridges[0].address,
    city: mockCommunityFridges[0].city,
    country: mockCommunityFridges[0].country,
  });

  // Extract unique countries
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    fridgesList.forEach((f) => set.add(f.country));
    listingsList.forEach((l) => {
      if (l.donorCountry) set.add(l.donorCountry);
    });
    return Array.from(set).sort();
  }, [fridgesList, listingsList]);

  // Distance formatting helper: meters if < 1 km, else km with 1 decimal
  const formatDistanceStr = (distKm: number): string => {
    if (distKm < 1) {
      const meters = Math.max(50, Math.round(distKm * 1000));
      return `${meters} m away`;
    }
    return `${distKm.toFixed(1)} km away`;
  };

  // Compute distance for all items and sort by proximity to user
  const sortedResources = useMemo<MapResourceItem[]>(() => {
    const list: MapResourceItem[] = [];

    // 1. Process Fridges
    fridgesList.forEach((f) => {
      let d = 5.0;
      if (userLoc.latitude && userLoc.longitude && f.latitude && f.longitude) {
        d = calculateDistanceKm(
          userLoc.latitude,
          userLoc.longitude,
          f.latitude,
          f.longitude
        );
      } else if (f.city.toLowerCase() === userLoc.city.toLowerCase()) {
        d = 0.8;
      }
      list.push({
        kind: "fridge",
        data: f,
        distanceKm: Number(d.toFixed(1)),
      });
    });

    // 2. Process Surplus Food Listings
    listingsList.forEach((l) => {
      let d = 6.0;
      if (userLoc.latitude && userLoc.longitude && l.latitude && l.longitude) {
        d = calculateDistanceKm(
          userLoc.latitude,
          userLoc.longitude,
          l.latitude,
          l.longitude
        );
      } else if (l.donorCity.toLowerCase() === userLoc.city.toLowerCase()) {
        d = 1.1;
      }
      list.push({
        kind: "listing",
        data: l,
        distanceKm: Number(d.toFixed(1)),
      });
    });

    // Sort by proximity ascending
    return list.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [fridgesList, listingsList, userLoc.latitude, userLoc.longitude, userLoc.city]);

  // Automatically select the nearest item when user location coordinates or city change
  useEffect(() => {
    if (sortedResources.length > 0) {
      const nearest = sortedResources[0];
      if (nearest.kind === "fridge") {
        setSelectedItem({
          id: nearest.data.id,
          type: "fridge",
          lat: nearest.data.latitude,
          lng: nearest.data.longitude,
          title: nearest.data.name,
          address: nearest.data.address,
          city: nearest.data.city,
          country: nearest.data.country,
        });
      } else {
        setSelectedItem({
          id: nearest.data.id,
          type: "listing",
          lat: nearest.data.latitude || 22.5518,
          lng: nearest.data.longitude || 88.3524,
          title: nearest.data.title,
          address: nearest.data.donorAddress,
          city: nearest.data.donorCity,
          country: nearest.data.donorCountry || "India",
        });
      }
    }
  }, [userLoc.city, userLoc.latitude, userLoc.longitude]);

  // Filtered resources for the list
  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return sortedResources.filter((item) => {
      // 1. Tab filter
      if (filterTab === "fridges" && item.kind !== "fridge") return false;
      if (filterTab === "surplus" && item.kind !== "listing") return false;
      if (filterTab === "kitchens") {
        if (item.kind !== "fridge") return false;
        if (item.data.type !== "community_kitchen" && item.data.type !== "food_bank") return false;
      }

      const itemCity = item.kind === "fridge" ? item.data.city : item.data.donorCity;
      const itemCountry = item.kind === "fridge" ? item.data.country : (item.data.donorCountry || "");
      const itemContinent = item.kind === "fridge" ? item.data.continent : "Asia";
      const itemTitle = item.kind === "fridge" ? item.data.name : item.data.title;
      const itemAddress = item.kind === "fridge" ? item.data.address : item.data.donorAddress;

      // 2. Continent filter
      if (selectedContinent !== "All Continents" && itemContinent !== selectedContinent) {
        return false;
      }

      // 3. Country filter
      if (selectedCountry !== "All Countries" && itemCountry !== selectedCountry) {
        return false;
      }

      // 4. Search query
      if (q) {
        const matches =
          itemTitle.toLowerCase().includes(q) ||
          itemCity.toLowerCase().includes(q) ||
          itemCountry.toLowerCase().includes(q) ||
          itemAddress.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [sortedResources, filterTab, selectedContinent, selectedCountry, searchQuery]);

  const handleDropOff = (locationName: string) => {
    setDropOffNotification(`Thank you! Your donation was logged to ${locationName}.`);
    setTimeout(() => setDropOffNotification(null), 4000);
  };

  const getStockBadge = (level: string) => {
    switch (level) {
      case "stocked":
        return (
          <span className="rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
            🟢 Stocked
          </span>
        );
      case "low":
        return (
          <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
            🟡 Running Low
          </span>
        );
      case "empty":
        return (
          <span className="rounded-full bg-rose-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-rose-800">
            🔴 Needs Restock
          </span>
        );
      default:
        return null;
    }
  };

  // Find the selected resource's full record
  const selectedResource = useMemo(() => {
    if (selectedItem.type === "fridge") {
      const f = fridgesList.find((item) => item.id === selectedItem.id);
      return f ? { kind: "fridge" as const, data: f } : null;
    } else {
      const l = listingsList.find((item) => item.id === selectedItem.id);
      return l ? { kind: "listing" as const, data: l } : null;
    }
  }, [selectedItem, fridgesList, listingsList]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] pb-24">
      {/* Top Banner with Real-Time Location Indicator */}
      <div className="border-b border-black/[0.06] bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-[0.04em]">
                <Globe2 className="h-4 w-4" />
                <span>Hyper-Local Mutual Aid & Surplus Matcher</span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[10px] font-medium text-emerald-800">
                  📍 {userLoc.displayName || `${userLoc.city}, ${userLoc.country}`}
                  {userLoc.accuracy ? ` • ±${Math.round(userLoc.accuracy)}m` : ""}
                </span>
              </div>
              <h1 className="mt-1.5 text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.035em]">
                Live Community Map & Resource Radar
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
                Live interactive map displaying free community fridges, mutual-aid pantries, and fresh surplus
                food donations sorted by real-time distance from your exact position.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {/* GPS High Precision Refresh Button */}
              <button
                onClick={() => detectBrowserLocation()}
                disabled={isDetecting}
                title="Acquire device high-precision GPS satellite fix"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.1] bg-[#f5f5f7] px-4 py-2.5 text-xs font-medium text-[#1d1d1f] hover:bg-white transition cursor-pointer disabled:opacity-60"
              >
                {isDetecting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                ) : (
                  <Navigation className="h-3.5 w-3.5 text-emerald-600" />
                )}
                <span>Locate Me</span>
              </button>

              {/* Live GPS Radar Tracking Toggle */}
              <button
                onClick={toggleLiveTracking}
                title={isLiveTracking ? "Pause continuous live tracking" : "Start continuous live GPS tracking"}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition cursor-pointer ${
                  isLiveTracking
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "border border-black/[0.1] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-white"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {isLiveTracking && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isLiveTracking ? "bg-white" : "bg-emerald-600"
                    }`}
                  ></span>
                </span>
                <span>{isLiveTracking ? "Live GPS Active" : "Live Radar"}</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-[#333336] transition cursor-pointer"
              >
                <Plus className="h-4 w-4 text-emerald-400" />
                Suggest Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {dropOffNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#1d1d1f] px-6 py-3.5 text-xs font-medium text-white shadow-2xl animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{dropOffNotification}</span>
        </div>
      )}

      {/* Status banner if location was recently detected */}
      {statusMessage && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 px-4 py-2 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Main Map Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {/* Search, Tabs & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between bg-white p-4.5 rounded-[24px] border border-black/[0.08] shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
            <input
              type="text"
              placeholder="Search by city (Kolkata, Mumbai, Delhi, Singapore...), name, or food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/[0.08] bg-[#f5f5f7] pl-10 pr-4 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:border-[#1d1d1f] focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Tab Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filterTab === "all"
                  ? "bg-[#1d1d1f] text-white shadow-xs"
                  : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.06]"
              }`}
            >
              All Resources ({sortedResources.length})
            </button>
            <button
              onClick={() => setFilterTab("fridges")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filterTab === "fridges"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.06]"
              }`}
            >
              🧊 Fridges & Pantries ({fridgesList.length})
            </button>
            <button
              onClick={() => setFilterTab("surplus")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filterTab === "surplus"
                  ? "bg-amber-700 text-white shadow-xs"
                  : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.06]"
              }`}
            >
              🍱 Food Surplus ({listingsList.length})
            </button>
            <button
              onClick={() => setFilterTab("kitchens")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filterTab === "kitchens"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.06]"
              }`}
            >
              🍲 Community Kitchens
            </button>

            {/* Continent Selector */}
            <select
              value={selectedContinent}
              onChange={(e) => {
                setSelectedContinent(e.target.value);
                setSelectedCountry("All Countries");
              }}
              className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3 py-1.5 text-xs font-medium text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              {CONTINENTS.map((cont) => (
                <option key={cont} value={cont}>
                  {cont}
                </option>
              ))}
            </select>

            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3 py-1.5 text-xs font-medium text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              <option value="All Countries">All Countries</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Hub Filter Strip */}
        <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider shrink-0">
            Quick Hubs:
          </span>
          {["Kolkata", "Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Chennai", "Singapore", "London", "Tokyo", "New York"].map(
            (city) => (
              <button
                key={city}
                onClick={() => setLocationByCity(city)}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition cursor-pointer ${
                  userLoc.city.toLowerCase() === city.toLowerCase()
                    ? "bg-[#1d1d1f] text-white shadow-xs"
                    : "bg-white border border-black/[0.08] text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                {city}
              </button>
            )
          )}
        </div>

        {/* Split Grid: Left Column Cards, Right Column Real-Time Map & Detail Card */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sorted Location & Listing Cards */}
          <div className="lg:col-span-5 space-y-3 max-h-[860px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs font-medium text-[#6e6e73] px-1 pb-1">
              <span>
                Sorted by proximity to <strong>{userLoc.city}</strong> ({filteredResources.length} items)
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">Live Proximity</span>
            </div>

            {filteredResources.map((item) => {
              if (item.kind === "fridge") {
                const loc = item.data;
                const isSelected = selectedItem.id === loc.id;
                const isUserCity = loc.city.toLowerCase() === userLoc.city.toLowerCase();

                return (
                  <div
                    key={`fridge-${loc.id}`}
                    onClick={() =>
                      setSelectedItem({
                        id: loc.id,
                        type: "fridge",
                        lat: loc.latitude,
                        lng: loc.longitude,
                        title: loc.name,
                        address: loc.address,
                        city: loc.city,
                        country: loc.country,
                      })
                    }
                    className={`p-4.5 rounded-[22px] border transition cursor-pointer ${
                      isSelected
                        ? "bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/15"
                        : "bg-white border-black/[0.08] hover:border-black/[0.15] shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                            🧊 {loc.city}, {loc.country}
                          </span>
                          {isUserCity && (
                            <span className="rounded-full bg-emerald-100/90 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                              Your City
                            </span>
                          )}
                          <span className="rounded-full bg-black/[0.05] px-2 py-0.2 text-[10px] font-medium text-[#6e6e73]">
                            {formatDistanceStr(item.distanceKm)}
                          </span>
                        </div>

                        <h3 className="mt-1 text-sm sm:text-base font-semibold text-[#1d1d1f] tracking-tight truncate">
                          {loc.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#6e6e73] flex items-center gap-1 truncate">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#86868b]" />
                          <span className="truncate">{loc.address}</span>
                        </p>
                      </div>

                      <div className="shrink-0">{getStockBadge(loc.inventoryLevel)}</div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-black/[0.06] flex items-center justify-between text-xs font-medium text-[#6e6e73]">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-emerald-600" />
                        {loc.operatingHours}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        View on Live Map →
                      </span>
                    </div>
                  </div>
                );
              } else {
                // Food Surplus Listing Card
                const listing = item.data;
                const isSelected = selectedItem.id === listing.id;
                const isUserCity = listing.donorCity.toLowerCase() === userLoc.city.toLowerCase();

                return (
                  <div
                    key={`listing-${listing.id}`}
                    onClick={() =>
                      setSelectedItem({
                        id: listing.id,
                        type: "listing",
                        lat: listing.latitude || 22.5518,
                        lng: listing.longitude || 88.3524,
                        title: listing.title,
                        address: listing.donorAddress,
                        city: listing.donorCity,
                        country: listing.donorCountry || "India",
                      })
                    }
                    className={`p-4.5 rounded-[22px] border transition cursor-pointer ${
                      isSelected
                        ? "bg-white border-amber-600 shadow-md ring-2 ring-amber-600/15"
                        : "bg-white border-black/[0.08] hover:border-black/[0.15] shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
                            🍱 {listing.donorCity}, {listing.donorCountry}
                          </span>
                          {isUserCity && (
                            <span className="rounded-full bg-amber-100/90 px-2 py-0.2 text-[10px] font-bold text-amber-900">
                              Your Area
                            </span>
                          )}
                          <span className="rounded-full bg-black/[0.05] px-2 py-0.2 text-[10px] font-medium text-[#6e6e73]">
                            {formatDistanceStr(item.distanceKm)}
                          </span>
                        </div>

                        <h3 className="mt-1 text-sm sm:text-base font-semibold text-[#1d1d1f] tracking-tight truncate">
                          {listing.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#6e6e73] flex items-center gap-1 truncate">
                          <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-[#86868b]" />
                          <span>From: <strong>{listing.donorName}</strong></span>
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span className="rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          {listing.price === 0 ? "FREE" : `${userLoc.currencySymbol}${listing.price}`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-black/[0.06] flex items-center justify-between text-xs font-medium text-[#6e6e73]">
                      <span className="text-[11px] text-[#86868b]">
                        Pickup: {listing.pickupStartTime} - {listing.pickupEndTime}
                      </span>
                      <span className="text-[11px] text-amber-700 font-semibold">
                        View on Live Map →
                      </span>
                    </div>
                  </div>
                );
              }
            })}

            {filteredResources.length === 0 && (
              <div className="rounded-[22px] border border-dashed border-black/[0.12] bg-white p-10 text-center">
                <MapPin className="mx-auto h-8 w-8 text-[#86868b]" />
                <h4 className="mt-2 text-sm font-semibold text-[#1d1d1f]">
                  No resources found in this filter
                </h4>
                <p className="mt-1 text-xs text-[#6e6e73]">
                  Try resetting your continent, country, or tab filter.
                </p>
                <button
                  onClick={() => {
                    setFilterTab("all");
                    setSelectedContinent("All Continents");
                    setSelectedCountry("All Countries");
                    setSearchQuery("");
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1d1d1f] px-4 py-2 text-xs font-medium text-white cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Genuine Real-Time Map & Detailed Card */}
          <div className="lg:col-span-7 flex flex-col gap-6 sticky top-6">
            {/* Real-Time Interactive Live Map Inside the Box */}
            <RealTimeMap
              center={[selectedItem.lat, selectedItem.lng]}
              zoom={14}
              userLocation={
                userLoc.latitude && userLoc.longitude
                  ? {
                      latitude: userLoc.latitude,
                      longitude: userLoc.longitude,
                      city: userLoc.city,
                      neighborhood: userLoc.neighborhood,
                      displayName: userLoc.displayName,
                      accuracy: userLoc.accuracy,
                    }
                  : null
              }
              fridges={fridgesList}
              listings={listingsList}
              selectedItem={selectedItem}
              isTrackingLive={isLiveTracking}
              onRecenterUser={() => {
                if (userLoc.latitude && userLoc.longitude) {
                  // Keep user position centered
                }
              }}
              onSelectFridge={(fridge) => {
                setSelectedItem({
                  id: fridge.id,
                  type: "fridge",
                  lat: fridge.latitude,
                  lng: fridge.longitude,
                  title: fridge.name,
                  address: fridge.address,
                  city: fridge.city,
                  country: fridge.country,
                });
              }}
              onSelectListing={(listing) => {
                setSelectedItem({
                  id: listing.id,
                  type: "listing",
                  lat: listing.latitude || 22.5518,
                  lng: listing.longitude || 88.3524,
                  title: listing.title,
                  address: listing.donorAddress,
                  city: listing.donorCity,
                  country: listing.donorCountry || "India",
                });
              }}
              className="h-80 sm:h-[400px]"
            />

            {/* Selected Resource Profile Card */}
            {selectedResource?.kind === "fridge" ? (
              /* Community Fridge Details */
              <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-black/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        🧊 Community Fridge & Mutual Aid Pantry
                      </span>
                      <span className="text-xs text-[#86868b]">• {selectedResource.data.city}, {selectedResource.data.country}</span>
                    </div>
                    <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                      {selectedResource.data.name}
                    </h2>
                    <p className="mt-1 text-xs text-[#6e6e73] flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{selectedResource.data.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStockBadge(selectedResource.data.inventoryLevel)}
                  </div>
                </div>

                {/* Operating & Civic Verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#f5f5f7] p-4 border border-black/[0.04]">
                    <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                      Operating Schedule
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f]">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>{selectedResource.data.operatingHours}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#6e6e73]">
                      {selectedResource.data.is24_7
                        ? "Open 24 hours for food pickup or drop-off."
                        : "Monitored during posted volunteer hours."}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f5f5f7] p-4 border border-black/[0.04]">
                    <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                      Civic Mutual Aid
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>100% Free Public Resource</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#6e6e73]">
                      Take what you need, leave what you can. No paperwork required.
                    </p>
                  </div>
                </div>

                {/* Live Inventory Breakdown */}
                <div>
                  <h4 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-2.5">
                    Live Inventory Stock
                  </h4>
                  <div className="space-y-2">
                    {selectedResource.data.inventoryItems.map((inv, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-black/[0.06] bg-[#fbfbfd] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                      >
                        <div>
                          <strong className="text-xs text-[#1d1d1f]">{inv.category}:</strong>{" "}
                          <span className="text-xs text-[#6e6e73]">{inv.items.join(" • ")}</span>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-700 shrink-0">
                          Restocked {inv.lastRestocked}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Urgently Needed Items */}
                {selectedResource.data.urgentlyNeeded.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      <span>Urgently Needed for Restock</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.data.urgentlyNeeded.map((need, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-rose-50 border border-rose-200/80 px-3 py-1 text-xs font-medium text-rose-800"
                        >
                          ⚠️ {need.item} ({need.urgency} urgency)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Row */}
                <div className="pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-[#6e6e73]">
                    Have surplus food to share? Drop off sealed, fresh vegetarian or dry goods.
                  </span>
                  <button
                    onClick={() => handleDropOff(selectedResource.data.name)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-full bg-[#1d1d1f] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#333336] transition cursor-pointer"
                  >
                    <HeartHandshake className="h-4 w-4 text-emerald-400" />
                    Log Drop-off
                  </button>
                </div>
              </div>
            ) : selectedResource?.kind === "listing" ? (
              /* Food Surplus Listing Details */
              <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-black/[0.06]">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                        🍱 Surplus Food Donation
                      </span>
                      <span className="text-xs text-[#86868b]">
                        • {selectedResource.data.donorCity}, {selectedResource.data.donorCountry}
                      </span>
                    </div>
                    <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                      {selectedResource.data.title}
                    </h2>
                    <p className="mt-1 text-xs text-[#6e6e73] flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                      <span>
                        Donor: <strong>{selectedResource.data.donorName}</strong> ({selectedResource.data.donorAddress})
                      </span>
                    </p>
                  </div>

                  <div className="shrink-0">
                    <span className="text-lg font-bold text-emerald-700">
                      {selectedResource.data.price === 0
                        ? "100% FREE"
                        : `${userLoc.currencySymbol}${selectedResource.data.price}`}
                    </span>
                  </div>
                </div>

                {/* Description & Quantity */}
                <div className="rounded-2xl bg-[#f5f5f7] p-4 border border-black/[0.04]">
                  <p className="text-xs text-[#1d1d1f] leading-relaxed">
                    {selectedResource.data.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-[#6e6e73]">
                    <span>Quantity: <strong className="text-[#1d1d1f]">{selectedResource.data.quantity}</strong></span>
                    <span>•</span>
                    <span>Category: <strong className="text-[#1d1d1f]">{selectedResource.data.category}</strong></span>
                  </div>
                </div>

                {/* Pickup Window */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#fbfbfd] p-3.5 border border-black/[0.06]">
                    <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                      Pickup Window
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f]">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>
                        {selectedResource.data.pickupStartTime} - {selectedResource.data.pickupEndTime}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#fbfbfd] p-3.5 border border-black/[0.06]">
                    <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                      Dietary Tags
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedResource.data.dietaryTags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                  <span className="text-xs text-[#6e6e73]">
                    Direct pickup reservation available.
                  </span>
                  <Link
                    href={`/listings?id=${selectedResource.data.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition cursor-pointer"
                  >
                    <span>Claim This Surplus</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Suggest Modal */}
      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={(newLoc) => {
          setFridgesList([newLoc, ...fridgesList]);
          setSelectedItem({
            id: newLoc.id,
            type: "fridge",
            lat: newLoc.latitude,
            lng: newLoc.longitude,
            title: newLoc.name,
            address: newLoc.address,
            city: newLoc.city,
            country: newLoc.country,
          });
          setDropOffNotification(`Added "${newLoc.name}" to global community map!`);
          setTimeout(() => setDropOffNotification(null), 4000);
        }}
      />
    </div>
  );
}
