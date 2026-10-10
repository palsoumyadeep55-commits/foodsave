"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Ticket,
  MapPin,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  RefreshCw,
  QrCode,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface MyClaimItem {
  id: string;
  listingId: string;
  claimerName: string;
  claimerRole: string;
  pickupSlot: string;
  status: "pending" | "approved" | "fulfilled" | "rejected" | "cancelled";
  verificationCode: string;
  claimedAt: string;
  notes?: string;
  listing: {
    id: string;
    title: string;
    donorName: string;
    donorAddress: string;
    quantity: string;
    category: string;
    price: number;
    currencySymbol?: string;
    expiryTime: string;
  };
}

export default function MyClaimsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<MyClaimItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/claims");
      const data = await res.json();
      if (data.success && data.claims) {
        setClaims(data.claims);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleCancelClaim = async (claimId: string) => {
    if (!confirm("Are you sure you want to release this claim so another neighbour can rescue it?")) return;
    try {
      const res = await fetch("/api/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, status: "cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchClaims();
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-emerald-100 backdrop-blur-md">
              <Ticket className="h-3.5 w-3.5" />
              Claimer Pickup Passes
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              My Food Rescue Claims
            </h1>
            <p className="text-sm text-emerald-100">
              Active verification codes and pickup details for <strong className="text-white">{user?.fullName || "Claimer"}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/listings"
              className="px-4 py-2 bg-white text-emerald-950 font-semibold rounded-full text-xs hover:bg-emerald-50 transition shadow-xs"
            >
              Browse Surplus
            </Link>
            <button
              onClick={fetchClaims}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Claim status cards */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-black/[0.06]">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-neutral-400" />
            <p className="text-sm text-neutral-500 mt-3 font-medium">Loading your rescue claims...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-black/[0.06] space-y-4">
            <ShoppingBag className="h-10 w-10 mx-auto text-neutral-400" />
            <div>
              <p className="text-base font-bold text-neutral-800">You haven&apos;t claimed any surplus food yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Explore fresh local bakery surplus, hotel dinners, and grocery produce ready for rescue today.
              </p>
            </div>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition shadow-xs"
            >
              Find Available Food Near You
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-3xl border border-black/[0.06] overflow-hidden shadow-xs hover:border-black/[0.12] transition"
              >
                {/* Status indicator bar */}
                <div
                  className={`px-6 py-2.5 flex items-center justify-between text-xs font-semibold ${
                    claim.status === "fulfilled"
                      ? "bg-emerald-50 text-emerald-800 border-b border-emerald-100"
                      : claim.status === "approved"
                      ? "bg-blue-50 text-blue-800 border-b border-blue-100"
                      : claim.status === "pending"
                      ? "bg-amber-50 text-amber-800 border-b border-amber-100"
                      : "bg-neutral-50 text-neutral-700 border-b border-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {claim.status === "fulfilled" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    {claim.status === "approved" && <ShieldCheck className="h-4 w-4 text-blue-600" />}
                    {claim.status === "pending" && <Clock className="h-4 w-4 text-amber-600" />}
                    <span className="uppercase tracking-wider">
                      Status: {claim.status === "approved" ? "Approved • Ready for Pickup" : claim.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    Claimed {new Date(claim.claimedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{claim.listing?.title}</h3>
                      <p className="text-xs text-neutral-600 mt-1">
                        Donor: <strong className="text-neutral-900">{claim.listing?.donorName}</strong> • {claim.listing?.quantity}
                      </p>
                    </div>

                    {/* Prominent Verification Code Pass */}
                    <div className="p-3 bg-neutral-900 text-white rounded-2xl flex items-center gap-3 self-start shadow-xs">
                      <QrCode className="h-6 w-6 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 block font-semibold">
                          Pickup Security PIN
                        </span>
                        <span className="font-mono text-base font-bold tracking-wider text-emerald-300">
                          {claim.verificationCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-2xl space-y-1">
                      <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                        Pickup Location
                      </span>
                      <p className="font-semibold text-neutral-900">{claim.listing?.donorAddress}</p>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-2xl space-y-1">
                      <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-neutral-400" />
                        Selected Timeslot
                      </span>
                      <p className="font-semibold text-neutral-900">{claim.pickupSlot}</p>
                    </div>
                  </div>

                  {/* Instructions and Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-neutral-100">
                    <p className="text-neutral-500">
                      💡 Show the 6-character PIN above to the kitchen staff when collecting your food containers.
                    </p>
                    {claim.status !== "fulfilled" && claim.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancelClaim(claim.id)}
                        className="text-rose-600 hover:text-rose-700 font-medium self-end sm:self-auto"
                      >
                        Cancel Claim
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
