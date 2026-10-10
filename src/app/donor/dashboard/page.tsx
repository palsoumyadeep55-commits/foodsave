"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  PlusCircle,
  CheckCircle2,
  Clock,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  PackageCheck,
  RefreshCw,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface ClaimItem {
  id: string;
  listingId: string;
  claimerName: string;
  claimerEmail?: string;
  claimerPhone?: string;
  claimerRole: string;
  pickupSlot: string;
  notes?: string;
  status: "pending" | "approved" | "fulfilled" | "rejected" | "cancelled";
  verificationCode: string;
  claimedAt: string;
  listing: {
    id: string;
    title: string;
    donorName: string;
    donorAddress: string;
    quantity: string;
    category: string;
    price: number;
    currencySymbol?: string;
    status: string;
  };
}

export default function DonorDashboardPage() {
  const { user, role, switchRole } = useAuth();
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [codeInput, setCodeInput] = useState<{ [key: string]: string }>({});
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

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

  const handleUpdateStatus = async (claimId: string, newStatus: string, code?: string) => {
    setVerifyingId(claimId);
    setMessage(null);
    try {
      const res = await fetch("/api/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId,
          status: newStatus,
          verificationCodeInput: code,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          text: `Success: Claim status changed to ${newStatus.toUpperCase()}`,
          type: "success",
        });
        await fetchClaims();
      } else {
        setMessage({
          text: data.error || "Failed to update claim",
          type: "error",
        });
      }
    } catch (e: any) {
      setMessage({ text: e?.message || "Network error", type: "error" });
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  const pendingCount = claims.filter((c) => c.status === "pending").length;
  const approvedCount = claims.filter((c) => c.status === "approved").length;
  const fulfilledCount = claims.filter((c) => c.status === "fulfilled").length;

  return (
    <div className="min-h-screen bg-[#fbfbfd] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Donor Banner */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-amber-100 backdrop-blur-md">
              <Store className="h-3.5 w-3.5" />
              Verified Food Donor Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {user?.organizationName || "Bandra Homestyle Kitchen"}
            </h1>
            <p className="text-sm text-amber-100 max-w-xl">
              Logged in as <span className="font-semibold text-white">{user?.fullName}</span>. Manage incoming surplus claims, verify pickup security PINs, and maintain seamless handover.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-amber-900 font-semibold text-sm hover:bg-amber-50 transition shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              Post New Surplus
            </Link>
            <button
              onClick={fetchClaims}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status notice */}
        {message && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Pending Approval
              </span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mt-2">{pendingCount}</p>
            <p className="text-xs text-neutral-500 mt-1">Requires your confirmation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Ready for Pickup
              </span>
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mt-2">{approvedCount}</p>
            <p className="text-xs text-neutral-500 mt-1">Awaiting claimer handover</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Fulfilled Rescues
              </span>
              <PackageCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-900 mt-2">{fulfilledCount}</p>
            <p className="text-xs text-neutral-500 mt-1">Successfully rescued food</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["all", "pending", "approved", "fulfilled"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                  filterStatus === st
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-600 border border-black/[0.06] hover:bg-neutral-50"
                }`}
              >
                {st === "all" ? "All Claims" : st}
              </button>
            ))}
          </div>
          <span className="text-xs font-medium text-neutral-500">
            {filteredClaims.length} records
          </span>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-black/[0.06]">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-neutral-400" />
              <p className="text-sm text-neutral-500 mt-3 font-medium">Loading claims...</p>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-black/[0.06]">
              <Store className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
              <p className="text-sm font-semibold text-neutral-800">No claims match this status</p>
              <p className="text-xs text-neutral-500 mt-1">
                New pickup requests from individuals and NGOs will appear here.
              </p>
            </div>
          ) : (
            filteredClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-3xl border border-black/[0.06] p-5 sm:p-6 shadow-xs hover:border-black/[0.12] transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{claim.listing?.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                      <span className="font-semibold text-neutral-700">{claim.listing?.quantity}</span>
                      <span>•</span>
                      <span>Claimed by: <strong className="text-neutral-900">{claim.claimerName}</strong> ({claim.claimerRole})</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide self-start sm:self-auto ${
                      claim.status === "fulfilled"
                        ? "bg-emerald-100 text-emerald-800"
                        : claim.status === "approved"
                        ? "bg-blue-100 text-blue-800"
                        : claim.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-neutral-500 font-medium">Pickup Timeslot:</p>
                    <p className="font-semibold text-neutral-900 mt-0.5">{claim.pickupSlot}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-neutral-500 font-medium">Claimer Contact:</p>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {claim.claimerPhone || claim.claimerEmail || "No phone provided"}
                    </p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-neutral-500 font-medium">Claimer Notes:</p>
                    <p className="font-semibold text-neutral-900 mt-0.5 truncate">
                      {claim.notes || "None"}
                    </p>
                  </div>
                </div>

                {/* Handover & Action Row */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-100">
                  {claim.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={verifyingId === claim.id}
                        onClick={() => handleUpdateStatus(claim.id, "approved")}
                        className="px-4 py-2 bg-emerald-700 text-white rounded-full text-xs font-semibold hover:bg-emerald-800 transition"
                      >
                        Approve for Pickup
                      </button>
                      <button
                        disabled={verifyingId === claim.id}
                        onClick={() => handleUpdateStatus(claim.id, "rejected")}
                        className="px-4 py-2 border border-rose-200 text-rose-700 rounded-full text-xs font-semibold hover:bg-rose-50 transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {claim.status === "approved" && (
                    <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1 max-w-xs">
                        <KeyRound className="h-4 w-4 absolute left-3 top-2.5 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Enter Claimer PIN (e.g. FS-123456)"
                          value={codeInput[claim.id] || ""}
                          onChange={(e) =>
                            setCodeInput({ ...codeInput, [claim.id]: e.target.value.toUpperCase() })
                          }
                          className="w-full pl-9 pr-3 py-2 border rounded-full text-xs font-mono tracking-wider uppercase border-neutral-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                        />
                      </div>
                      <button
                        disabled={verifyingId === claim.id}
                        onClick={() =>
                          handleUpdateStatus(claim.id, "fulfilled", codeInput[claim.id] || claim.verificationCode)
                        }
                        className="px-4 py-2 bg-neutral-900 text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        Verify Code & Complete Handover
                      </button>
                    </div>
                  )}

                  {claim.status === "fulfilled" && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Handover completed successfully (Security PIN: {claim.verificationCode})
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
