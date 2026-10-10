"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  ShoppingBag,
  Refrigerator,
  MapPin,
  Calculator,
  Menu,
  X,
  PlusCircle,
  User,
  Store,
  Building2,
  ChevronDown,
  Check,
  Ticket,
} from "lucide-react";
import { useLocation } from "@/context/location-context";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const { location } = useLocation();
  const { user, role, switchRole, demoAccounts } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/listings", label: "Surplus Matcher", icon: ShoppingBag },
    { href: "/fridge", label: "Fridge Rescue", icon: Refrigerator },
    { href: "/map", label: "Community Map", icon: MapPin },
    { href: "/calculator", label: "Waste Calculator", icon: Calculator },
  ];

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case "donor":
        return Store;
      case "ngo":
        return Building2;
      default:
        return User;
    }
  };

  const getRoleBadge = (userRole: string) => {
    switch (userRole) {
      case "donor":
        return { label: "Donor Hub", bg: "bg-amber-100 text-amber-800 border-amber-200" };
      case "ngo":
        return { label: "NGO Hub", bg: "bg-blue-100 text-blue-800 border-blue-200" };
      default:
        return { label: "Individual", bg: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    }
  };

  const CurrentRoleIcon = getRoleIcon(role);
  const roleBadge = getRoleBadge(role);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs group-hover:bg-emerald-800 transition">
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-[-0.03em] text-[#1d1d1f] group-hover:text-emerald-700 transition">
              Food<span className="text-emerald-700">Save</span>
            </span>
            <span className="block text-[9px] font-semibold tracking-[0.05em] text-[#86868b] uppercase -mt-0.5">
              Global Zero Waste
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.01em] transition ${
                  isActive
                    ? "bg-[#1d1d1f] text-white"
                    : "text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-[#86868b]"}`} />
                {link.label}
              </Link>
            );
          })}

          {/* Role specific links */}
          {role === "donor" && (
            <Link
              href="/donor/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition ${
                pathname.startsWith("/donor")
                  ? "bg-amber-700 text-white"
                  : "text-amber-800 bg-amber-50 hover:bg-amber-100"
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              Donor Hub
            </Link>
          )}

          {role === "ngo" && (
            <Link
              href="/ngo/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition ${
                pathname.startsWith("/ngo")
                  ? "bg-blue-700 text-white"
                  : "text-blue-800 bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              NGO Logistics
            </Link>
          )}

          {role === "individual" && (
            <Link
              href="/my-claims"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition ${
                pathname.startsWith("/my-claims")
                  ? "bg-emerald-700 text-white"
                  : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
              }`}
            >
              <Ticket className="h-3.5 w-3.5" />
              My Claims
            </Link>
          )}
        </nav>

        {/* Action Button & Role Switcher */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Active location tag */}
          <Link
            href="/map"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.06] text-[12px] font-medium text-[#1d1d1f] hover:bg-black/[0.05] transition"
            title={`Active Location: ${location.city}, ${location.country}`}
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>{location.city}, {location.countryCode}</span>
          </Link>

          {/* Role selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition bg-white hover:bg-neutral-50 shadow-2xs"
            >
              <CurrentRoleIcon className="h-3.5 w-3.5 text-neutral-600" />
              <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${roleBadge.bg}`}>
                {roleBadge.label}
              </span>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-black/10 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <p className="text-xs font-semibold text-neutral-900">Switch Role Persona</p>
                  <p className="text-[11px] text-neutral-500">
                    Active: <span className="font-medium text-emerald-700">{user?.fullName}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  {demoAccounts.map((account) => {
                    const Icon = getRoleIcon(account.role);
                    const isCurrent = role === account.role;
                    return (
                      <button
                        key={account.role}
                        onClick={() => switchRole(account.role)}
                        className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition ${
                          isCurrent
                            ? "bg-neutral-100 font-semibold text-neutral-900"
                            : "hover:bg-neutral-50 text-neutral-700"
                        }`}
                      >
                        <Icon className="h-4 w-4 mt-0.5 text-emerald-700 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{account.label}</p>
                          <p className="text-[10px] text-neutral-500">{account.org}</p>
                        </div>
                        {isCurrent && <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/listings/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-[#333336] transition shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
            Post Surplus
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/listings/new"
            className="p-2 rounded-full bg-[#1d1d1f] text-white"
            title="Post Surplus"
          >
            <PlusCircle className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#1d1d1f] hover:bg-black/[0.04]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/[0.06] bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="p-3 bg-neutral-50 rounded-2xl mb-3">
            <p className="text-xs font-semibold text-neutral-500 mb-2">Switch Active Role:</p>
            <div className="grid grid-cols-3 gap-1.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  onClick={() => {
                    switchRole(account.role);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 text-xs rounded-xl font-medium border text-center transition ${
                    role === account.role
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-700 border-neutral-200"
                  }`}
                >
                  {account.role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-tight ${
                  isActive ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:bg-black/[0.04]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-[#86868b]"}`} />
                {link.label}
              </Link>
            );
          })}

          {role === "donor" && (
            <Link
              href="/donor/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-50 text-amber-900"
            >
              <Store className="h-4 w-4 text-amber-700" />
              Donor Hub & Verification
            </Link>
          )}

          {role === "ngo" && (
            <Link
              href="/ngo/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-900"
            >
              <Building2 className="h-4 w-4 text-blue-700" />
              NGO Logistics & Bulk Claims
            </Link>
          )}

          {role === "individual" && (
            <Link
              href="/my-claims"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-900"
            >
              <Ticket className="h-4 w-4 text-emerald-700" />
              My Claims & Verification Pass
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
