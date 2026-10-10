"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/types";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  primaryRole: UserRole;
  phoneNumber?: string | null;
  city?: string | null;
  organizationName?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (newRole: UserRole) => Promise<void>;
  demoAccounts: { role: UserRole; email: string; label: string; org?: string }[];
}

const DEMO_ACCOUNTS = [
  {
    role: "individual" as UserRole,
    email: "individual@foodsave.org",
    label: "Aarav Sen (Household / Community Claimer)",
    org: "Individual",
  },
  {
    role: "donor" as UserRole,
    email: "donor@foodsave.org",
    label: "Chef Priya Sharma (Restaurant & Bakery Donor)",
    org: "Bandra Homestyle Kitchen",
  },
  {
    role: "ngo" as UserRole,
    email: "ngo@foodsave.org",
    label: "Robin Hood Army (NGO Logistics Co-ordinator)",
    org: "Meals For All Foundation",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage or default to Individual
  useEffect(() => {
    try {
      const stored = localStorage.getItem("foodsave_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to demo individual
        const defaultUser: AuthUser = {
          id: "user-ind-1",
          email: "individual@foodsave.org",
          fullName: "Aarav Sen",
          primaryRole: "individual",
          phoneNumber: "+91 98301 23456",
          city: "Kolkata",
        };
        setUser(defaultUser);
        localStorage.setItem("foodsave_user", JSON.stringify(defaultUser));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password = "foodsave123") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("foodsave_user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch (e: any) {
      return { success: false, error: e?.message || "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("foodsave_user");
  };

  const switchRole = async (newRole: UserRole) => {
    const demo = DEMO_ACCOUNTS.find((a) => a.role === newRole);
    if (demo) {
      await login(demo.email, "foodsave123");
    }
  };

  const role: UserRole = user?.primaryRole || "individual";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        login,
        logout,
        switchRole,
        demoAccounts: DEMO_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
