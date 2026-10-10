"use client";

import React, { useState } from "react";
import { FoodListingItem } from "@/types";
import { X, CheckCircle2, Clock, MapPin, Building2, Sparkles, HeartHandshake } from "lucide-react";

interface ClaimModalProps {
  listing: FoodListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (listingId: string, slot: string, notes: string) => void;
}

export function ClaimModal({ listing, isOpen, onClose, onConfirm }: ClaimModalProps) {
  const [selectedSlot, setSelectedSlot] = useState("First Available Slot");
  const [notes, setNotes] = useState("");
  const [claimedSuccess, setClaimedSuccess] = useState(false);

  if (!isOpen || !listing) return null;

  const handleConfirm = () => {
    onConfirm(listing.id, selectedSlot, notes);
    setClaimedSuccess(true);
  };

  const handleDone = () => {
    setClaimedSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-zinc-100 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {!claimedSuccess ? (
          <div>
            <div className="flex items-center gap-2 text-emerald-600">
              <HeartHandshake className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Rescue Surplus Food</span>
            </div>

            <h2 className="mt-2 text-xl font-bold text-zinc-900">
              Claim: {listing.title}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              By claiming, you commit to picking up the food during the designated window.
            </p>

            {/* Listing Summary box */}
            <div className="mt-5 rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-semibold text-zinc-900">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  {listing.donorName}
                </span>
                <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px]">
                  {listing.price === 0 ? "100% Free" : `$${listing.price.toFixed(2)} discounted`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                <span>{listing.donorAddress}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>Available window: {listing.pickupStartTime} – {listing.pickupEndTime}</span>
              </div>
            </div>

            {/* Pickup time slot select */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Select Your Pickup Window
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="First Available Slot">Earliest ({listing.pickupStartTime})</option>
                <option value="Mid-window Slot">Mid-window (approx 30 mins after start)</option>
                <option value="End of window Slot">Near closing ({listing.pickupEndTime})</option>
              </select>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Pickup Notes for Donor (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Bringing own container, will arrive on bicycle, NGO representative..."
                rows={2}
                className="w-full rounded-xl border border-zinc-300 p-2.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-zinc-300 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition"
              >
                <Sparkles className="h-4 w-4" />
                Confirm Claim
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Food Successfully Claimed!</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
                The donor has been notified. Please present this confirmation at{" "}
                <strong>{listing.donorName}</strong> during your pickup window ({selectedSlot}).
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium">
              Pickup Code: #RESCUE-{Math.floor(1000 + Math.random() * 9000)}
            </div>
            <button
              onClick={handleDone}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              Great, got it!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
