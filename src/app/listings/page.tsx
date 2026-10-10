"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { initialListings } from "@/lib/mock-data";
import { FoodListingItem, DietaryTag } from "@/types";
import { ListingCard } from "@/components/listings/listing-card";
import { ClaimModal } from "@/components/listings/claim-modal";
import { useLocation } from "@/context/location-context";
import { calculateDistanceKm } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  ArrowUpDown,
  Sparkles,
  Globe2,
} from "lucide-react";

export default function ListingsPage() {
  const { location: userLoc } = useLocation();
  const [listings, setListings] = useState<FoodListingItem[]>(initialListings);
  const [loadingListings, setLoadingListings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All Countries");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [selectedDiet, setSelectedDiet] = useState<string>("All Diets");
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"urgent" | "distance" | "free">("urgent");

  // Claim modal state
  const [activeListingForClaim, setActiveListingForClaim] = useState<FoodListingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch live listings from backend API
  React.useEffect(() => {
    async function loadLiveListings() {
      setLoadingListings(true);
      try {
        const res = await fetch("/api/listings");
        const data = await res.json();
        if (data.success && data.listings && data.listings.length > 0) {
          // Merge with initialListings if needed or use live data
          setListings(data.listings);
        }
      } catch (err) {
        console.warn("Using fallback initial listings:", err);
      } finally {
        setLoadingListings(false);
      }
    }
    loadLiveListings();
  }, []);

  const categories = ["All", "Meals", "Produce", "Bakery", "Dairy"];
  const countries = ["All Countries", "India", "Singapore", "Japan", "United States", "United Kingdom", "Spain"];
  const cities = ["All Cities", "Mumbai", "Delhi NCR", "Bengaluru", "Singapore", "Tokyo", "New York", "London", "Madrid"];
  const diets = ["All Diets", "Vegetarian", "Vegan", "Bulk Lots"];

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;
        const matchesCountry =
          selectedCountry === "All Countries" || item.donorCountry === selectedCountry;
        const matchesCity =
          selectedCity === "All Cities" || item.donorCity === selectedCity;
        const matchesDiet =
          selectedDiet === "All Diets"
            ? true
            : selectedDiet === "Bulk Lots"
            ? item.isBulkEventSurplus
            : item.dietaryTags?.includes(selectedDiet as DietaryTag);

        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.donorAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.donorCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.donorCountry && item.donorCountry.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFree = !freeOnly || item.price === 0;

        return matchesCategory && matchesCountry && matchesCity && matchesDiet && matchesSearch && matchesFree;
      })
      .sort((a, b) => {
        if (sortBy === "urgent") {
          return new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime();
        }
        if (sortBy === "distance") {
          const distA =
            userLoc.latitude && userLoc.longitude && a.latitude && a.longitude
              ? calculateDistanceKm(userLoc.latitude, userLoc.longitude, a.latitude, a.longitude)
              : a.distanceKm;
          const distB =
            userLoc.latitude && userLoc.longitude && b.latitude && b.longitude
              ? calculateDistanceKm(userLoc.latitude, userLoc.longitude, b.latitude, b.longitude)
              : b.distanceKm;
          return distA - distB;
        }
        if (sortBy === "free") {
          return a.price - b.price;
        }
        return 0;
      });
  }, [listings, searchQuery, selectedCategory, selectedCity, selectedDiet, freeOnly, sortBy, userLoc]);

  const handleOpenClaim = (listing: FoodListingItem) => {
    setActiveListingForClaim(listing);
    setIsModalOpen(true);
  };

  const handleConfirmClaim = (listingId: string, slot: string, notes: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, status: "claimed" } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] pb-20">
      {/* Top Banner */}
      <div className="border-b border-black/[0.06] bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-[0.04em]">
                <Globe2 className="h-4 w-4" />
                <span>Global & Asian Surplus Food Network</span>
              </div>
              <h1 className="mt-1 text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.035em]">
                Surplus Food Matcher
              </h1>
              <p className="mt-1.5 text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
                Connect restaurants, catering banquets, wedding halls, and wet markets with nearby people and food relief NGOs.
                Vegetarian, Vegan, and organic surplus clearly marked.
              </p>
            </div>

            <Link
              href="/listings/new"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#333336] transition cursor-pointer self-start md:self-auto"
            >
              <PlusCircle className="h-4 w-4 text-emerald-400" />
              Post Surplus (Daily or Wedding)
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-[18px] border border-black/[0.06] bg-[#f5f5f7] p-3.5 text-center">
              <span className="text-xl font-semibold text-[#1d1d1f] tracking-tight">{listings.length}</span>
              <p className="text-[11px] font-medium text-[#6e6e73]">Active Surplus Listings</p>
            </div>
            <div className="rounded-[18px] border border-black/[0.06] bg-[#f5f5f7] p-3.5 text-center">
              <span className="text-xl font-semibold text-emerald-700 tracking-tight">
                {listings.filter((l) => l.price === 0).length}
              </span>
              <p className="text-[11px] font-medium text-[#6e6e73]">100% Free Lots</p>
            </div>
            <div className="rounded-[18px] border border-black/[0.06] bg-[#f5f5f7] p-3.5 text-center">
              <span className="text-xl font-semibold text-[#1d1d1f] tracking-tight">
                {listings.filter((l) => l.isBulkEventSurplus).length} Bulk
              </span>
              <p className="text-[11px] font-medium text-[#6e6e73]">Wedding / Mandi Lots</p>
            </div>
            <div className="rounded-[18px] border border-black/[0.06] bg-[#f5f5f7] p-3.5 text-center">
              <span className="text-xl font-semibold text-[#1d1d1f] tracking-tight">~54 kg</span>
              <p className="text-[11px] font-medium text-[#6e6e73]">Food Diverted Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-7">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white p-4 rounded-[22px] border border-black/[0.08] shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search tiffin, biryani, mangoes, bread, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/[0.08] pl-10 pr-4 py-2 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Country & City Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedCity("All Cities");
              }}
              className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3.5 py-1.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3.5 py-1.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Diet Filter */}
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3.5 py-1.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              {diets.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <button
              onClick={() => setFreeOnly(!freeOnly)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                freeOnly
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-[#1d1d1f] border-black/[0.1] hover:bg-[#f5f5f7]"
              }`}
            >
              Free Only
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-medium text-[#1d1d1f]">
              <ArrowUpDown className="h-3 w-3 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer"
              >
                <option value="urgent">Expiring Soon</option>
                <option value="distance">Nearest</option>
                <option value="free">Lowest Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1d1d1f] text-white shadow-xs"
                  : "bg-white text-[#6e6e73] border border-black/[0.08] hover:bg-[#f5f5f7]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="mt-7">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onClaim={handleOpenClaim}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-black/[0.12] bg-white p-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300" />
              <h3 className="mt-3 text-base font-semibold text-[#1d1d1f]">No matching surplus listings found</h3>
              <p className="mt-1 text-xs text-[#86868b] max-w-sm mx-auto">
                Try switching city to "All Cities" or selecting "All Diets".
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedCity("All Cities");
                  setSelectedDiet("All Diets");
                  setFreeOnly(false);
                }}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#1d1d1f] px-5 py-2 text-xs font-semibold text-white hover:bg-[#333336] transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        listing={activeListingForClaim}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClaim}
      />
    </div>
  );
}
