import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode, WORLD_COUNTRIES } from "@/lib/countries";

export async function GET(request: NextRequest) {
  // Check forwarded client IP headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  let clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "";

  // If local / private IP, treat as empty so external geo service checks egress IP
  if (
    !clientIp ||
    clientIp === "::1" ||
    clientIp === "127.0.0.1" ||
    clientIp.startsWith("192.168.") ||
    clientIp.startsWith("10.") ||
    clientIp.startsWith("172.") ||
    clientIp.startsWith("fe80:")
  ) {
    clientIp = "";
  }

  // 1. Try ipwho.is
  try {
    const targetUrl = clientIp ? `https://ipwho.is/${clientIp}` : "https://ipwho.is/";
    const res = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // cache 5 mins
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const countryInfo = getCountryByCode(data.country_code);
        return NextResponse.json({
          success: true,
          city: data.city || data.region || countryInfo?.majorHubs[0] || "Kolkata",
          country: data.country || countryInfo?.name || "India",
          countryCode: data.country_code || "IN",
          continent: data.continent || countryInfo?.continent || "Asia",
          currencySymbol: countryInfo?.currencySymbol || "₹",
          currencyCode: countryInfo?.currencyCode || "INR",
          latitude: data.latitude || 22.5726,
          longitude: data.longitude || 88.3639,
          source: "ip",
          provider: "ipwho.is",
        });
      }
    }
  } catch (err) {
    // ipwho.is failed, continue to fallback
  }

  // 2. Try freeipapi.com
  try {
    const targetUrl = clientIp ? `https://freeipapi.com/api/json/${clientIp}` : "https://freeipapi.com/api/json";
    const res = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.countryName) {
        const countryInfo = getCountryByCode(data.countryCode);
        return NextResponse.json({
          success: true,
          city: data.cityName || countryInfo?.majorHubs[0] || "Kolkata",
          country: data.countryName || countryInfo?.name || "India",
          countryCode: data.countryCode || "IN",
          continent: countryInfo?.continent || "Asia",
          currencySymbol: countryInfo?.currencySymbol || "₹",
          currencyCode: countryInfo?.currencyCode || "INR",
          latitude: data.latitude || 22.5726,
          longitude: data.longitude || 88.3639,
          source: "ip",
          provider: "freeipapi.com",
        });
      }
    }
  } catch (err) {
    // continue to fallback
  }

  // 3. Fallback default
  return NextResponse.json({
    success: true,
    city: "Kolkata",
    country: "India",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    latitude: 22.5726,
    longitude: 88.3639,
    source: "default",
    provider: "fallback",
  });
}
