"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MapPin, Sparkles, Globe2 } from "lucide-react";
import { LocationType, CommunityLocationItem } from "@/types";
import { WORLD_COUNTRIES } from "@/lib/countries";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (loc: CommunityLocationItem) => void;
}

export function AddLocationModal({ isOpen, onClose, onAdded }: AddLocationModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<LocationType>("community_fridge");
  const [countryCode, setCountryCode] = useState("IN");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("24/7 Access");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const selectedCountry = WORLD_COUNTRIES.find((c) => c.code === countryCode) || WORLD_COUNTRIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoc: CommunityLocationItem = {
      id: `loc-${Date.now()}`,
      name: name.trim(),
      type,
      city: city.trim() || selectedCountry.majorHubs[0] || "Central Hub",
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
      continent: selectedCountry.continent,
      address: address.trim(),
      latitude: 0,
      longitude: 0,
      operatingHours: hours.trim(),
      is24_7: hours.toLowerCase().includes("24/7"),
      isVerified: false,
      inventoryLevel: "stocked",
      inventoryItems: [
        {
          category: "Initial Restock",
          items: ["Community contribution newly logged"],
          lastRestocked: "Just now",
        },
      ],
      urgentlyNeeded: [],
    };

    onAdded(newLoc);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl border border-black/[0.08] sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-[#86868b] hover:bg-black/[0.04] hover:text-[#1d1d1f] transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <MapPin className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em]">
                Global Community Network
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#1d1d1f] tracking-[-0.02em]">
              Suggest a Community Fridge or Food Hub
            </h2>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              Help neighbors across all countries locate mutual-aid fridges and civic pantries.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                Location Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kyoto Kawaramachi Mutual Aid Fridge"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3.5 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f] transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                  Country *
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f] transition"
                >
                  {WORLD_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.continent})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto, Mumbai, Berlin"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3.5 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f] transition"
              >
                <option value="community_fridge">Community Fridge</option>
                <option value="food_bank">Food Bank / Pantry</option>
                <option value="community_kitchen">Community Kitchen</option>
                <option value="civic_pantry">Civic Pantry</option>
                <option value="shelter">Shelter Kitchen</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                Full Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 154 Kawaramachi-dori, Nakagyo-ku"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3.5 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                Operating Hours
              </label>
              <input
                type="text"
                placeholder="e.g. 24/7 Access or Mon-Sat 8:00 AM - 9:00 PM"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full rounded-xl border border-black/[0.1] bg-[#f5f5f7] px-3.5 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:outline-none focus:border-[#1d1d1f] transition"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/[0.1] px-5 py-2 text-xs font-medium text-[#1d1d1f] hover:bg-black/[0.04] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full bg-[#1d1d1f] px-6 py-2 text-xs font-medium text-white hover:bg-[#333336] transition cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Submit to Global Registry
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-[#1d1d1f]">Location Added to Map</h3>
            <p className="text-xs text-[#6e6e73] max-w-sm mx-auto leading-relaxed">
              Thank you for strengthening mutual aid. This hub is now visible in the global directory for volunteers and neighbors.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full rounded-full bg-[#1d1d1f] py-2.5 text-xs font-semibold text-white hover:bg-[#333336] transition cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
