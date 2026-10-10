"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Clock,
  Package,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Info,
  Globe2,
} from "lucide-react";
import { WORLD_COUNTRIES } from "@/lib/countries";
import { useAuth } from "@/context/auth-context";

export default function PostSurplusPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Bakery",
    quantity: "",
    isFree: true,
    price: "0",
    originalPrice: "",
    donorName: "",
    donorCountry: "India",
    donorCity: "Mumbai",
    donorAddress: "",
    pickupStartTime: "18:00",
    pickupEndTime: "20:00",
    hoursUntilExpiry: "4",
  });

  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-fill donor details if logged in as donor
  React.useEffect(() => {
    if (user?.organizationName || user?.fullName) {
      setFormData((prev) => ({
        ...prev,
        donorName: prev.donorName || user.organizationName || user.fullName,
        donorCity: prev.donorCity || user.city || "Mumbai",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          quantity: formData.quantity,
          price: formData.isFree ? 0 : parseFloat(formData.price) || 0,
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          donorName: formData.donorName,
          donorCountry: formData.donorCountry,
          donorCity: formData.donorCity,
          donorAddress: formData.donorAddress,
          pickupStartTime: formData.pickupStartTime,
          pickupEndTime: formData.pickupEndTime,
          expiryTime: new Date(Date.now() + (parseInt(formData.hoursUntilExpiry) || 4) * 3600 * 1000).toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          router.push("/listings");
        }, 1500);
      } else {
        setErrorMsg(data.error || "Failed to create listing");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error submitting listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-16 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-emerald-600 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Donor Portal
                </span>
                <h1 className="mt-1 text-2xl font-extrabold text-zinc-900">
                  Post Food Surplus
                </h1>
                <p className="mt-1 text-xs text-zinc-500">
                  Fill in details of unsold or near-expiry edible food items to notify nearby users and food charities.
                </p>
              </div>

              {/* Business Details */}
              <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Donor Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Business or Donor Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunrise Artisan Bakery"
                      value={formData.donorName}
                      onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Pickup Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 104 Market St, Suite 2"
                      value={formData.donorAddress}
                      onChange={(e) => setFormData({ ...formData, donorAddress: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={formData.donorCountry}
                      onChange={(e) => setFormData({ ...formData, donorCountry: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                    >
                      {WORLD_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name} ({c.currencySymbol} {c.currencyCode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Tokyo, London"
                      value={formData.donorCity}
                      onChange={(e) => setFormData({ ...formData, donorCity: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Food Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-emerald-600" />
                  Food Item Details
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 Fresh Baguettes & Croissants"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Bakery">Bakery</option>
                      <option value="Produce">Produce / Fruits & Veggies</option>
                      <option value="Meals">Prepared Meals</option>
                      <option value="Dairy">Dairy & Eggs</option>
                      <option value="Pantry">Pantry / Groceries</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Quantity Description *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 6 loaves, or approx 3.5 kg"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Description & Allergen Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Baked fresh this morning. Contains gluten. Packaged in paper bags ready for pickup."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-zinc-300 p-3 text-sm text-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Pricing & Pickup Times */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Pickup & Pricing
                </h3>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFree: e.target.checked,
                          price: e.target.checked ? "0" : formData.price,
                        })
                      }
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-semibold text-zinc-800">
                      Offer 100% Free (Recommended for food banks / quick rescue)
                    </span>
                  </label>
                </div>

                {!formData.isFree && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Discounted Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Original Retail Value ($)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Pickup Window Start
                    </label>
                    <input
                      type="time"
                      value={formData.pickupStartTime}
                      onChange={(e) => setFormData({ ...formData, pickupStartTime: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Pickup Window End
                    </label>
                    <input
                      type="time"
                      value={formData.pickupEndTime}
                      onChange={(e) => setFormData({ ...formData, pickupEndTime: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Hours until Expiry
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="72"
                      value={formData.hoursUntilExpiry}
                      onChange={(e) => setFormData({ ...formData, hoursUntilExpiry: e.target.value })}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm text-zinc-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <Link
                  href="/listings"
                  className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700 transition cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  Publish Surplus Listing
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900">Surplus Listing Published!</h2>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Nearby neighbors and verified food banks have been alerted. Redirecting back to the marketplace...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
