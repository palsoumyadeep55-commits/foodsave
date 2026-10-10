import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode, WORLD_COUNTRIES } from "@/lib/countries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!latStr || !lngStr) {
    return NextResponse.json({ success: false, error: "Latitude and longitude required" }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ success: false, error: "Invalid coordinates" }, { status: 400 });
  }

  // 1. Try BigDataCloud Free Client Reverse Geocoder (ultra-fast, exact locality and administrative levels)
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(bdcUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.city || data.locality || data.principalSubdivision)) {
        const detectedCity = data.city || data.principalSubdivision || "Local Area";
        const neighborhood = data.locality && data.locality !== detectedCity ? data.locality : "";
        const detectedCountry = data.countryName || "India";
        const detectedCountryCode = (data.countryCode || "IN").toUpperCase();
        const countryInfo = getCountryByCode(detectedCountryCode);
        const displayName = neighborhood ? `${neighborhood}, ${detectedCity}` : detectedCity;

        return NextResponse.json({
          success: true,
          city: detectedCity,
          neighborhood: neighborhood,
          displayName: displayName,
          state: data.principalSubdivision || "",
          country: detectedCountry,
          countryCode: detectedCountryCode,
          postcode: data.postcode || "",
          continent: countryInfo?.continent || "Asia",
          currencySymbol: countryInfo?.currencySymbol || "₹",
          currencyCode: countryInfo?.currencyCode || "INR",
          latitude: lat,
          longitude: lng,
          source: "gps",
          provider: "bigdatacloud",
        });
      }
    }
  } catch (err) {
    // try Nominatim
  }

  // 2. Try OpenStreetMap Nominatim with zoom=18 for street-level neighborhood precision
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(nomUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "FoodSaveApp-PrecisionRadar/2.0 (contact@foodsave.org)",
      },
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const detectedCity =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.state_district ||
        addr.county ||
        addr.state ||
        "Local Hub";
      const neighborhood =
        addr.neighbourhood ||
        addr.suburb ||
        addr.road ||
        addr.residential ||
        addr.quarter ||
        "";
      const detectedCountry = addr.country || "India";
      const detectedCountryCode = (addr.country_code || "in").toUpperCase();
      const countryInfo = getCountryByCode(detectedCountryCode);
      const displayName = neighborhood && neighborhood !== detectedCity
        ? `${neighborhood}, ${detectedCity}`
        : detectedCity;

      return NextResponse.json({
        success: true,
        city: detectedCity,
        neighborhood: neighborhood,
        displayName: displayName,
        state: addr.state || "",
        country: detectedCountry,
        countryCode: detectedCountryCode,
        postcode: addr.postcode || "",
        continent: countryInfo?.continent || "Asia",
        currencySymbol: countryInfo?.currencySymbol || "₹",
        currencyCode: countryInfo?.currencyCode || "INR",
        latitude: lat,
        longitude: lng,
        source: "gps",
        provider: "nominatim",
      });
    }
  } catch (err) {
    // continue
  }

  // 3. Fallback: Return raw coordinates with country code guess
  return NextResponse.json({
    success: true,
    city: "Local Area",
    neighborhood: "",
    displayName: `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
    country: "Local Region",
    countryCode: "IN",
    continent: "Asia",
    currencySymbol: "₹",
    currencyCode: "INR",
    latitude: lat,
    longitude: lng,
    source: "gps",
    provider: "coordinates",
  });
}
