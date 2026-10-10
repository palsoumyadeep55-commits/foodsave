"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { WORLD_COUNTRIES, CountryInfo, getCountryByCode } from "@/lib/countries";
import { calculateDistanceKm } from "@/lib/utils";

export interface UserLocationState {
  city: string;
  country: string;
  countryCode: string;
  continent: string;
  currencySymbol: string;
  currencyCode: string;
  latitude: number;
  longitude: number;
  accuracy?: number; // GPS precision in meters (e.g. ±12m)
  neighborhood?: string; // Suburb, road, or area
  displayName?: string; // Human-friendly display, e.g. "Park Street, Kolkata"
  isAutoDetected: boolean;
  source: "gps" | "ip" | "timezone" | "manual";
}

export interface KnownHub {
  city: string;
  country: string;
  countryCode: string;
  continent: string;
  currencySymbol: string;
  currencyCode: string;
  lat: number;
  lng: number;
  aliases: string[];
}

export const KNOWN_HUBS: KnownHub[] = [
  // India Hubs
  {
    city: "Kolkata",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 22.5726,
    lng: 88.3639,
    aliases: ["calcutta", "west bengal", "park street", "howrah", "salt lake", "sealdah", "dum dum", "ballygunge"],
  },
  {
    city: "Mumbai",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 19.0760,
    lng: 72.8777,
    aliases: ["bombay", "dadar", "bandra", "andheri", "navi mumbai", "thane", "kurla"],
  },
  {
    city: "Delhi NCR",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 28.6139,
    lng: 77.2090,
    aliases: ["delhi", "new delhi", "noida", "gurugram", "gurgaon", "ghaziabad", "faridabad"],
  },
  {
    city: "Bengaluru",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 12.9716,
    lng: 77.5946,
    aliases: ["bangalore", "whitefield", "koramangala", "indiranagar", "yeshwanthpur"],
  },
  {
    city: "Hyderabad",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 17.3850,
    lng: 78.4867,
    aliases: ["secunderabad", "cyberabad", "hitech city", "telangana"],
  },
  {
    city: "Chennai",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 13.0827,
    lng: 80.2707,
    aliases: ["madras", "tamil nadu", "t nagar", "adyar", "velachery", "anna nagar"],
  },
  {
    city: "Pune",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 18.5204,
    lng: 73.8567,
    aliases: ["kothrud", "viman nagar", "hinjawadi", "baner", "wakad", "shivajinagar"],
  },
  {
    city: "Ahmedabad",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 23.0225,
    lng: 72.5714,
    aliases: ["gandhinagar", "navrangpura", "bodakdev", "satellite", "gujarat"],
  },
  {
    city: "Jaipur",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 26.9124,
    lng: 75.7873,
    aliases: ["pink city", "malviya nagar", "vaishali nagar", "rajasthan"],
  },
  {
    city: "Lucknow",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 26.8467,
    lng: 80.9462,
    aliases: ["hazratganj", "gomti nagar", "alambagh", "uttar pradesh"],
  },
  {
    city: "Chandigarh",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 30.7333,
    lng: 76.7794,
    aliases: ["mohali", "panchkula", "tricity", "punjab", "haryana"],
  },
  {
    city: "Kochi",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    lat: 9.9312,
    lng: 76.2673,
    aliases: ["cochin", "ernakulam", "kakkanad", "fort kochi", "kerala"],
  },

  // Asia Hubs
  {
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    continent: "Asia",
    currencySymbol: "S$",
    currencyCode: "SGD",
    lat: 1.3521,
    lng: 103.8198,
    aliases: ["singapore central", "jurong", "tampines", "woodlands", "orchard", "chinatown"],
  },
  {
    city: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    continent: "Asia",
    currencySymbol: "¥",
    currencyCode: "JPY",
    lat: 35.6762,
    lng: 139.6503,
    aliases: ["shinjuku", "shibuya", "asakusa", "ginza", "yokohama", "taito"],
  },
  {
    city: "Seoul",
    country: "South Korea",
    countryCode: "KR",
    continent: "Asia",
    currencySymbol: "₩",
    currencyCode: "KRW",
    lat: 37.5665,
    lng: 126.9780,
    aliases: ["mapo", "gangnam", "hongdae", "busan", "incheon"],
  },
  {
    city: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    continent: "Asia",
    currencySymbol: "฿",
    currencyCode: "THB",
    lat: 13.7563,
    lng: 100.5018,
    aliases: ["chiang mai", "phuket", "sukhumvit"],
  },
  {
    city: "Jakarta",
    country: "Indonesia",
    countryCode: "ID",
    continent: "Asia",
    currencySymbol: "Rp",
    currencyCode: "IDR",
    lat: -6.2088,
    lng: 106.8456,
    aliases: ["bali", "surabaya", "bandung"],
  },

  // Europe Hubs
  {
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    continent: "Europe",
    currencySymbol: "£",
    currencyCode: "GBP",
    lat: 51.5074,
    lng: -0.1278,
    aliases: ["brixton", "soho", "camden", "hackney", "manchester", "birmingham", "uk"],
  },
  {
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
    continent: "Europe",
    currencySymbol: "€",
    currencyCode: "EUR",
    lat: 52.5200,
    lng: 13.4050,
    aliases: ["kreuzberg", "mitte", "neukölln", "munich", "hamburg", "frankfurt"],
  },
  {
    city: "Paris",
    country: "France",
    countryCode: "FR",
    continent: "Europe",
    currencySymbol: "€",
    currencyCode: "EUR",
    lat: 48.8566,
    lng: 2.3522,
    aliases: ["belleville", "montmartre", "marais", "lyon", "marseille"],
  },
  {
    city: "Madrid",
    country: "Spain",
    countryCode: "ES",
    continent: "Europe",
    currencySymbol: "€",
    currencyCode: "EUR",
    lat: 40.4168,
    lng: -3.7038,
    aliases: ["lavapiés", "barcelona", "valencia", "seville"],
  },
  {
    city: "Rome",
    country: "Italy",
    countryCode: "IT",
    continent: "Europe",
    currencySymbol: "€",
    currencyCode: "EUR",
    lat: 41.9028,
    lng: 12.4964,
    aliases: ["florence", "milan", "naples", "venice"],
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    continent: "Europe",
    currencySymbol: "€",
    currencyCode: "EUR",
    lat: 52.3676,
    lng: 4.9041,
    aliases: ["rotterdam", "utrecht", "the hague"],
  },

  // Americas Hubs
  {
    city: "New York",
    country: "United States",
    countryCode: "US",
    continent: "North America",
    currencySymbol: "$",
    currencyCode: "USD",
    lat: 40.7128,
    lng: -74.0060,
    aliases: ["manhattan", "brooklyn", "queens", "nyc", "east village", "usa"],
  },
  {
    city: "Los Angeles",
    country: "United States",
    countryCode: "US",
    continent: "North America",
    currencySymbol: "$",
    currencyCode: "USD",
    lat: 34.0522,
    lng: -118.2437,
    aliases: ["la", "echo park", "hollywood", "santa monica", "long beach", "california"],
  },
  {
    city: "Toronto",
    country: "Canada",
    countryCode: "CA",
    continent: "North America",
    currencySymbol: "CA$",
    currencyCode: "CAD",
    lat: 43.6532,
    lng: -79.3832,
    aliases: ["kensington", "vancouver", "montreal", "ontario", "ottawa"],
  },
  {
    city: "Mexico City",
    country: "Mexico",
    countryCode: "MX",
    continent: "North America",
    currencySymbol: "Mex$",
    currencyCode: "MXN",
    lat: 19.4326,
    lng: -99.1332,
    aliases: ["cdmx", "roma norte", "condesa", "guadalajara", "monterrey"],
  },
  {
    city: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    continent: "South America",
    currencySymbol: "R$",
    currencyCode: "BRL",
    lat: -23.5505,
    lng: -46.6333,
    aliases: ["vila madalena", "rio de janeiro", "brasilia", "salvador"],
  },
  {
    city: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    continent: "South America",
    currencySymbol: "$",
    currencyCode: "ARS",
    lat: -34.6037,
    lng: -58.3816,
    aliases: ["san telmo", "palermo", "cordoba"],
  },

  // Africa Hubs
  {
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    continent: "Africa",
    currencySymbol: "KSh",
    currencyCode: "KES",
    lat: -1.2921,
    lng: 36.8219,
    aliases: ["kibera", "mombasa", "kisumu"],
  },
  {
    city: "Cape Town",
    country: "South Africa",
    countryCode: "ZA",
    continent: "Africa",
    currencySymbol: "R",
    currencyCode: "ZAR",
    lat: -33.9249,
    lng: 18.4241,
    aliases: ["observatory", "johannesburg", "durban", "pretoria"],
  },
  {
    city: "Lagos",
    country: "Nigeria",
    countryCode: "NG",
    continent: "Africa",
    currencySymbol: "₦",
    currencyCode: "NGN",
    lat: 6.5244,
    lng: 3.3792,
    aliases: ["abuja", "ibadan"],
  },

  // Oceania Hubs
  {
    city: "Sydney",
    country: "Australia",
    countryCode: "AU",
    continent: "Oceania",
    currencySymbol: "A$",
    currencyCode: "AUD",
    lat: -33.8688,
    lng: 151.2093,
    aliases: ["newtown", "melbourne", "brisbane", "perth", "adelaide"],
  },
  {
    city: "Auckland",
    country: "New Zealand",
    countryCode: "NZ",
    continent: "Oceania",
    currencySymbol: "NZ$",
    currencyCode: "NZD",
    lat: -36.8485,
    lng: 174.7633,
    aliases: ["ponsonby", "wellington", "christchurch"],
  },

  // Middle East Hubs
  {
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    continent: "Middle East",
    currencySymbol: "AED",
    currencyCode: "AED",
    lat: 25.2048,
    lng: 55.2708,
    aliases: ["al quoz", "abu dhabi", "sharjah"],
  },
];

interface LocationContextType {
  location: UserLocationState;
  setLocationByCity: (query: string) => boolean;
  setLocationExplicit: (loc: Partial<UserLocationState>) => void;
  detectBrowserLocation: () => Promise<boolean>;
  isDetecting: boolean;
  statusMessage: string | null;
  isLiveTracking: boolean;
  toggleLiveTracking: () => void;
}

// Map browser timezone to default country & city
function getTimezoneFallback(): UserLocationState {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    if (tz.includes("Kolkata") || tz.includes("Calcutta")) {
      return {
        city: "Kolkata",
        country: "India",
        countryCode: "IN",
        continent: "Asia",
        currencySymbol: "₹",
        currencyCode: "INR",
        latitude: 22.5726,
        longitude: 88.3639,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("Singapore")) {
      return {
        city: "Singapore",
        country: "Singapore",
        countryCode: "SG",
        continent: "Asia",
        currencySymbol: "S$",
        currencyCode: "SGD",
        latitude: 1.3521,
        longitude: 103.8198,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("Tokyo")) {
      return {
        city: "Tokyo",
        country: "Japan",
        countryCode: "JP",
        continent: "Asia",
        currencySymbol: "¥",
        currencyCode: "JPY",
        latitude: 35.6762,
        longitude: 139.6503,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("London")) {
      return {
        city: "London",
        country: "United Kingdom",
        countryCode: "GB",
        continent: "Europe",
        currencySymbol: "£",
        currencyCode: "GBP",
        latitude: 51.5074,
        longitude: -0.1278,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("New_York") || tz.includes("Detroit")) {
      return {
        city: "New York",
        country: "United States",
        countryCode: "US",
        continent: "North America",
        currencySymbol: "$",
        currencyCode: "USD",
        latitude: 40.7128,
        longitude: -74.0060,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("Los_Angeles")) {
      return {
        city: "Los Angeles",
        country: "United States",
        countryCode: "US",
        continent: "North America",
        currencySymbol: "$",
        currencyCode: "USD",
        latitude: 34.0522,
        longitude: -118.2437,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("Berlin") || tz.includes("Frankfurt")) {
      return {
        city: "Berlin",
        country: "Germany",
        countryCode: "DE",
        continent: "Europe",
        currencySymbol: "€",
        currencyCode: "EUR",
        latitude: 52.5200,
        longitude: 13.4050,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("Paris")) {
      return {
        city: "Paris",
        country: "France",
        countryCode: "FR",
        continent: "Europe",
        currencySymbol: "€",
        currencyCode: "EUR",
        latitude: 48.8566,
        longitude: 2.3522,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("Sydney")) {
      return {
        city: "Sydney",
        country: "Australia",
        countryCode: "AU",
        continent: "Oceania",
        currencySymbol: "A$",
        currencyCode: "AUD",
        latitude: -33.8688,
        longitude: 151.2093,
        isAutoDetected: true,
        source: "timezone",
      };
    }
    if (tz.includes("Dubai")) {
      return {
        city: "Dubai",
        country: "United Arab Emirates",
        countryCode: "AE",
        continent: "Middle East",
        currencySymbol: "AED",
        currencyCode: "AED",
        latitude: 25.2048,
        longitude: 55.2708,
        isAutoDetected: true,
        source: "timezone",
      };
    }
  } catch (e) {}

  // Default fallback if unknown
  return {
    city: "Kolkata",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    latitude: 22.5726,
    longitude: 88.3639,
    isAutoDetected: true,
    source: "timezone",
  };
}

const LocationContext = createContext<LocationContextType>({
  location: getTimezoneFallback(),
  setLocationByCity: () => false,
  setLocationExplicit: () => {},
  detectBrowserLocation: async () => false,
  isDetecting: false,
  statusMessage: null,
  isLiveTracking: false,
  toggleLiveTracking: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<UserLocationState>(getTimezoneFallback());
  const [isDetecting, setIsDetecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Clean up watch position on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Helper to persist in state and localStorage
  const persistLocation = useCallback((newLoc: UserLocationState) => {
    setLocation(newLoc);
    try {
      localStorage.setItem("foodsave_user_location", JSON.stringify(newLoc));
    } catch (e) {}
  }, []);

  // Fetch location via network IP Geolocation API (First-party Next.js API with external fallback)
  const fetchNetworkLocation = useCallback(async (): Promise<UserLocationState | null> => {
    // 1. First-party internal API route (never blocked by adblockers, CORS-free)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch("/api/location", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          const countryInfo = getCountryByCode(data.countryCode);
          return {
            city: data.city || countryInfo?.majorHubs[0] || "Kolkata",
            country: data.country || countryInfo?.name || "India",
            countryCode: data.countryCode || "IN",
            continent: data.continent || countryInfo?.continent || "Asia",
            currencySymbol: data.currencySymbol || countryInfo?.currencySymbol || "₹",
            currencyCode: data.currencyCode || countryInfo?.currencyCode || "INR",
            latitude: data.latitude || 22.5726,
            longitude: data.longitude || 88.3639,
            isAutoDetected: true,
            source: "ip",
          };
        }
      }
    } catch (e) {
      // fallback to direct client calls
    }

    // 2. Direct client fallback via ipwho.is
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("https://ipwho.is/", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          const countryInfo = getCountryByCode(data.country_code);
          return {
            city: data.city || data.region || countryInfo?.majorHubs[0] || "Kolkata",
            country: data.country || countryInfo?.name || "India",
            countryCode: data.country_code || "IN",
            continent: data.continent || countryInfo?.continent || "Asia",
            currencySymbol: countryInfo?.currencySymbol || "₹",
            currencyCode: countryInfo?.currencyCode || "INR",
            latitude: data.latitude || 22.5726,
            longitude: data.longitude || 88.3639,
            isAutoDetected: true,
            source: "ip",
          };
        }
      }
    } catch (err) {}

    return null;
  }, []);

  // Run on initial page mount: Check localStorage or Auto-Detect via IP
  useEffect(() => {
    let isMounted = true;

    async function initLocation() {
      // 1. Check if user already saved an explicit preference
      try {
        const saved = localStorage.getItem("foodsave_user_location");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.city && parsed.country && parsed.source === "manual") {
            if (isMounted) setLocation(parsed);
            return;
          }
        }
      } catch (e) {}

      // 2. Auto-detect via IP network
      const netLoc = await fetchNetworkLocation();
      if (netLoc && isMounted) {
        persistLocation(netLoc);
        return;
      }

      // 3. Timezone fallback
      const tzLoc = getTimezoneFallback();
      if (isMounted) {
        persistLocation(tzLoc);
      }
    }

    initLocation();
    return () => {
      isMounted = false;
    };
  }, [fetchNetworkLocation, persistLocation]);

  const setLocationExplicit = (partial: Partial<UserLocationState>) => {
    const updated: UserLocationState = {
      ...location,
      ...partial,
      isAutoDetected: false,
      source: "manual",
    };
    persistLocation(updated);
    setStatusMessage(`Location set to ${updated.city}, ${updated.country}`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const setLocationByCity = (query: string): boolean => {
    const q = query.trim().toLowerCase();
    if (!q) return false;

    // 1. Check known hubs
    const foundHub = KNOWN_HUBS.find(
      (h) =>
        h.city.toLowerCase() === q ||
        h.country.toLowerCase() === q ||
        h.aliases.some((a) => a === q || q.includes(a) || a.includes(q))
    );

    if (foundHub) {
      const newLoc: UserLocationState = {
        city: foundHub.city,
        country: foundHub.country,
        countryCode: foundHub.countryCode,
        continent: foundHub.continent,
        currencySymbol: foundHub.currencySymbol,
        currencyCode: foundHub.currencyCode,
        latitude: foundHub.lat,
        longitude: foundHub.lng,
        isAutoDetected: false,
        source: "manual",
      };
      persistLocation(newLoc);
      setStatusMessage(`📍 Location set to ${newLoc.city}, ${newLoc.country}`);
      setTimeout(() => setStatusMessage(null), 3500);
      return true;
    }

    // 2. Check world countries
    const foundCountry = WORLD_COUNTRIES.find(
      (c) =>
        c.name.toLowerCase() === q ||
        c.code.toLowerCase() === q ||
        c.majorHubs.some((hub) => hub.toLowerCase().includes(q))
    );

    if (foundCountry) {
      const matchedCity =
        foundCountry.majorHubs.find((h) => h.toLowerCase().includes(q)) ||
        foundCountry.majorHubs[0] ||
        foundCountry.name;

      const newLoc: UserLocationState = {
        city: matchedCity,
        country: foundCountry.name,
        countryCode: foundCountry.code,
        continent: foundCountry.continent,
        currencySymbol: foundCountry.currencySymbol,
        currencyCode: foundCountry.currencyCode,
        latitude: 0,
        longitude: 0,
        isAutoDetected: false,
        source: "manual",
      };
      persistLocation(newLoc);
      setStatusMessage(`📍 Location set to ${newLoc.city}, ${newLoc.country}`);
      setTimeout(() => setStatusMessage(null), 3500);
      return true;
    }

    // 3. Fallback: Accept custom user city input
    const formattedCity = query.trim().charAt(0).toUpperCase() + query.trim().slice(1);
    const customLoc: UserLocationState = {
      ...location,
      city: formattedCity,
      isAutoDetected: false,
      source: "manual",
    };
    persistLocation(customLoc);
    setStatusMessage(`📍 Location updated to ${customLoc.city}, ${customLoc.country}`);
    setTimeout(() => setStatusMessage(null), 3500);
    return true;
  };

  // High-accuracy Browser GPS with reverse-geocoding + IP fallback
  const detectBrowserLocation = async (): Promise<boolean> => {
    setIsDetecting(true);
    setStatusMessage("📡 Acquiring device GPS satellite coordinates...");

    // Try GPS first
    if (typeof window !== "undefined" && navigator.geolocation) {
      try {
        let pos: GeolocationPosition;
        try {
          pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 12000,
              maximumAge: 0,
            });
          });
        } catch (highAccError) {
          // Fallback retry with standard sensor if high accuracy times out
          pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 6000,
              maximumAge: 5000,
            });
          });
        }

        const { latitude, longitude, accuracy } = pos.coords;
        const roundedAccuracy = accuracy ? Math.round(accuracy) : 15;

        // 1. Call server-side reverse geocoder (/api/geocode) with street-level resolution
        try {
          const revRes = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`, {
            headers: { Accept: "application/json" },
          });
          if (revRes.ok) {
            const data = await revRes.json();
            if (data && data.success) {
              const countryInfo = getCountryByCode(data.countryCode);
              const gpsLoc: UserLocationState = {
                city: data.city || "Local Hub",
                neighborhood: data.neighborhood || "",
                displayName: data.displayName || data.city || "Local Area",
                country: data.country || "India",
                countryCode: data.countryCode || "IN",
                continent: data.continent || countryInfo?.continent || "Asia",
                currencySymbol: data.currencySymbol || countryInfo?.currencySymbol || "₹",
                currencyCode: data.currencyCode || countryInfo?.currencyCode || "INR",
                latitude: latitude,
                longitude: longitude,
                accuracy: roundedAccuracy,
                isAutoDetected: true,
                source: "gps",
              };

              persistLocation(gpsLoc);
              setIsDetecting(false);
              setStatusMessage(`🎯 Precise GPS Located: ${gpsLoc.displayName || gpsLoc.city} (±${roundedAccuracy}m)`);
              setTimeout(() => setStatusMessage(null), 4500);
              return true;
            }
          }
        } catch (revErr) {
          // Server reverse geocode failed, keep genuine coordinates!
        }

        // Geometric closest known hub for display, but KEEP USER'S REAL COORDINATES!
        let closestHub = KNOWN_HUBS[0];
        let minDistance = Infinity;
        for (const hub of KNOWN_HUBS) {
          const dist = calculateDistanceKm(latitude, longitude, hub.lat, hub.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestHub = hub;
          }
        }

        const fallbackGpsLoc: UserLocationState = {
          city: closestHub.city,
          neighborhood: "",
          displayName: `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
          country: closestHub.country,
          countryCode: closestHub.countryCode,
          continent: closestHub.continent,
          currencySymbol: closestHub.currencySymbol,
          currencyCode: closestHub.currencyCode,
          latitude: latitude,
          longitude: longitude,
          accuracy: roundedAccuracy,
          isAutoDetected: true,
          source: "gps",
        };
        persistLocation(fallbackGpsLoc);
        setIsDetecting(false);
        setStatusMessage(`🎯 High-Precision GPS: ${fallbackGpsLoc.displayName} (±${roundedAccuracy}m)`);
        setTimeout(() => setStatusMessage(null), 4500);
        return true;
      } catch (gpsError) {
        // GPS permission was denied or timed out — smoothly proceed to network detection!
      }
    }

    // IP Geolocation Fallback
    setStatusMessage("Detecting location via Network...");
    const ipLoc = await fetchNetworkLocation();
    if (ipLoc) {
      persistLocation(ipLoc);
      setIsDetecting(false);
      setStatusMessage(`🌐 Network Located: ${ipLoc.city}, ${ipLoc.country}`);
      setTimeout(() => setStatusMessage(null), 4000);
      return true;
    }

    // Timezone Fallback
    const tzLoc = getTimezoneFallback();
    persistLocation(tzLoc);
    setIsDetecting(false);
    setStatusMessage(`📍 Detected via Timezone: ${tzLoc.city}, ${tzLoc.country}`);
    setTimeout(() => setStatusMessage(null), 4000);
    return true;
  };

  // Live GPS tracking toggle using watchPosition
  const toggleLiveTracking = useCallback(() => {
    if (isLiveTracking) {
      if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveTracking(false);
      setStatusMessage("⏹️ Live GPS tracking paused.");
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      if (typeof window === "undefined" || !navigator.geolocation) {
        setStatusMessage("⚠️ Geolocation is not supported on this device.");
        setTimeout(() => setStatusMessage(null), 3500);
        return;
      }

      setIsLiveTracking(true);
      setStatusMessage("📡 Live GPS Radar Active: streaming real-time coordinates...");

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const roundedAcc = accuracy ? Math.round(accuracy) : 10;
          setLocation((prev) => ({
            ...prev,
            latitude,
            longitude,
            accuracy: roundedAcc,
            source: "gps",
            isAutoDetected: true,
          }));
          setStatusMessage(`📡 Live GPS: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}° (±${roundedAcc}m)`);
        },
        (err) => {
          setIsLiveTracking(false);
          setStatusMessage("⚠️ Live GPS error: " + err.message);
          setTimeout(() => setStatusMessage(null), 4000);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 2000,
          timeout: 10000,
        }
      );
    }
  }, [isLiveTracking]);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocationByCity,
        setLocationExplicit,
        detectBrowserLocation,
        isDetecting,
        statusMessage,
        isLiveTracking,
        toggleLiveTracking,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
