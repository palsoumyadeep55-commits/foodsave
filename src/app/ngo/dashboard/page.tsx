"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Package,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface BulkListing {
  id: string;
  title: string;
  donorName: string;
  donorCity: string;
  donorAddress: string;
  quantity: string;
  category: string;
  price: number;
  currencySymbol?: string;
  isBulkEventSurplus: boolean;
  status: string;
  expiryTime: string;
  pickupStartTime: string;
  pickupEndTime: string;
}

export default function NgoDashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<BulkListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Community need report state
  const [needFormOpen, setNeedFormOpen] = useState(false);
  const [needItem, setNeedItem] = useState("");
  const [needUrgency, setNeedUrgency] = useState("high");

  const fetchBulkListings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/listings?status=active");
      const data = await res.json();
      if (data.success && data.listings) {
        setListings(data.listings);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulkListings();
  }, []);

  const handleBulkClaim = async (listing: BulkListing) => {
    setClaimingId(listing.id);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          claimerName: user?.fullName || "Meals For All NGO Team",
          claimerEmail: user?.email || "ngo@foodsave.org",
          claimerPhone: user?.phoneNumber || "+91 99100 45678",
          claimerRole: "ngo",
          pickupSlot: "Urgent NGO Dispatch: within 2 hours",
          notes: "Dispatched dedicated temperature-controlled rescue van for shelter distribution.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          `Success: Claimed "${listing.title}". Verification code: ${data.claim.verificationCode}`
        );
        await fetchBulkListings();
      }
    } catch (e: any) {
      alert("Error submitting claim: " + e.message);
    } finally {
      setClaimingId(null);
    }
  };

  const bulkListings = listings.filter((l) => l.isBulkEventSurplus || l.quantity.toLowerCase().includes("kg") || l.quantity.toLowerCase().includes("feed"));

  return (
    <div className="min-h-screen bg-[#fbfbfd] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* NGO Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-blue-100 backdrop-blur-md">
              <Building2 className="h-3.5 w-3.5" />
              NGO Humanitarian Logistics Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {user?.organizationName || "Meals For All Foundation"}
            </h1>
            <p className="text-sm text-blue-100 max-w-xl">
              Coordinating partner: <strong className="text-white">{user?.fullName}</strong>. Claim large-scale banquet & supermarket surplus to feed community shelters and night shelters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setNeedFormOpen(!needFormOpen)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-blue-950 font-semibold text-sm hover:bg-blue-50 transition shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              Report Urgent Pantry Need
            </button>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 transition text-white font-semibold text-sm backdrop-blur-md"
            >
              <MapPin className="h-4 w-4" />
              Community Map
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Urgent Need Form (Expandable) */}
        {needFormOpen && (
          <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-200">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Register Urgent Food Need for Distribution
            </h3>
            <p className="text-xs text-neutral-500">
              Broadcasting an urgent need alerts registered commercial food donors and caterers in your municipality.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Item needed (e.g. 50 Meals, High-protein Lentils)"
                value={needItem}
                onChange={(e) => setNeedItem(e.target.value)}
                className="sm:col-span-2 px-4 py-2 text-xs border rounded-xl border-neutral-300 focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
              <select
                value={needUrgency}
                onChange={(e) => setNeedUrgency(e.target.value)}
                className="px-4 py-2 text-xs border rounded-xl border-neutral-300 focus:ring-2 focus:ring-blue-600 outline-hidden bg-white"
              >
                <option value="critical">Critical (Immediate dispatch)</option>
                <option value="high">High (Next 4 hours)</option>
                <option value="moderate">Moderate (Same day)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setNeedFormOpen(false)}
                className="px-4 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Broadcasted urgent request: "${needItem || "Nutritious meals"}" to local food network!`);
                  setNeedFormOpen(false);
                  setNeedItem("");
                }}
                className="px-4 py-1.5 bg-blue-700 text-white rounded-full text-xs font-semibold hover:bg-blue-800 transition"
              >
                Broadcast to Donors
              </button>
            </div>
          </div>
        )}

        {/* Priority Large-Scale Surplus Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Large-Scale Banquet & Commercial Surplus
              </h2>
              <p className="text-xs text-neutral-500">
                High-volume food allocations ideal for immediate NGO van dispatch and shelter relief.
              </p>
            </div>
            <button
              onClick={fetchBulkListings}
              className="p-2 rounded-full border border-black/[0.08] bg-white hover:bg-neutral-50 transition text-neutral-600"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-black/[0.06]">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-neutral-400" />
              <p className="text-sm text-neutral-500 mt-3 font-medium">Scanning live surplus...</p>
            </div>
          ) : bulkListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-black/[0.06]">
              <Package className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
              <p className="text-sm font-semibold text-neutral-800">No active large-volume surplus</p>
              <p className="text-xs text-neutral-500 mt-1">
                All bulk lots currently claimed or pending new hotel/banquet postings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bulkListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-3xl border border-blue-100 p-5 shadow-xs hover:border-blue-300 transition flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    High Volume Surplus
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-neutral-900 pr-24">{listing.title}</h3>
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      Donor: <strong className="text-neutral-900">{listing.donorName}</strong> ({listing.donorCity})
                    </p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                        {listing.quantity}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">100% Free for Rescue</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{listing.donorAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <Clock className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span>Expires: {new Date(listing.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <button
                    disabled={claimingId === listing.id}
                    onClick={() => handleBulkClaim(listing)}
                    className="w-full py-2.5 bg-blue-900 text-white rounded-full text-xs font-semibold hover:bg-blue-800 transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4 text-blue-300" />
                    {claimingId === listing.id ? "Securing allocation..." : "Dispatch NGO Van & Claim Lot"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
