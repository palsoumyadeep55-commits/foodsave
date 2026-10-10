import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseSafeDate(val: any, fallbackOffsetMs: number = 0): Date {
  if (!val) return new Date(Date.now() + fallbackOffsetMs);
  if (val instanceof Date && !isNaN(val.getTime())) return val;
  if (typeof val === "string") {
    // If it's a time string like "18:00" or "18:30:00"
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(val.trim())) {
      const parts = val.trim().split(":").map(Number);
      const d = new Date();
      d.setHours(parts[0], parts[1], 0, 0);
      return d;
    }
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date(Date.now() + fallbackOffsetMs);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "active";
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (city && city !== "All Locations" && city !== "All Cities") {
      where.donorCity = {
        contains: city,
      };
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (maxPrice !== null && maxPrice !== undefined && maxPrice !== "") {
      const priceVal = parseFloat(maxPrice);
      if (!isNaN(priceVal)) {
        where.price = { lte: priceVal };
      }
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
        { donorName: { contains: search.trim() } },
      ];
    }

    const listings = await prisma.foodListing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        claims: {
          select: {
            id: true,
            status: true,
            claimerRole: true,
            pickupSlot: true,
            verificationCode: true,
            claimedAt: true,
          },
        },
      },
    });

    const parsedListings = listings.map((item) => ({
      ...item,
      allergens: item.allergens ? JSON.parse(item.allergens) : [],
      dietaryTags: item.dietaryTags ? JSON.parse(item.dietaryTags) : [],
      expiryTime: item.expiryTime.toISOString(),
      pickupStartTime: item.pickupStartTime
        ? item.pickupStartTime.toISOString().substring(11, 16)
        : "16:00",
      pickupEndTime: item.pickupEndTime
        ? item.pickupEndTime.toISOString().substring(11, 16)
        : "19:00",
    }));

    return NextResponse.json({
      success: true,
      count: parsedListings.length,
      listings: parsedListings,
    });
  } catch (error: any) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      donorName,
      donorType = "bakery",
      donorCity,
      donorCountry = "India",
      donorCountryCode = "IN",
      donorAddress,
      category = "Meals",
      quantity,
      price = 0,
      originalPrice,
      currencySymbol = "₹",
      expiryTime,
      pickupStartTime,
      pickupEndTime,
      allergens = [],
      dietaryTags = [],
      isBulkEventSurplus = false,
      latitude,
      longitude,
      imageUrl,
    } = body;

    if (!title || !donorName || !donorCity || !quantity) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, donorName, donorCity, quantity" },
        { status: 400 }
      );
    }

    const expiryDate = parseSafeDate(expiryTime, 12 * 3600 * 1000);
    const pickupStart = parseSafeDate(pickupStartTime, 1 * 3600 * 1000);
    const pickupEnd = parseSafeDate(pickupEndTime, 4 * 3600 * 1000);

    const listing = await prisma.foodListing.create({
      data: {
        title,
        description: description || null,
        donorName,
        donorType,
        donorCity,
        donorCountry,
        donorCountryCode,
        donorAddress: donorAddress || `${donorCity} City Center`,
        category,
        quantity,
        price: Number(price) || 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        currencySymbol,
        expiryTime: expiryDate,
        pickupStartTime: pickupStart,
        pickupEndTime: pickupEnd,
        status: "active",
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        imageUrl: imageUrl || null,
        allergens: JSON.stringify(allergens),
        dietaryTags: JSON.stringify(dietaryTags),
        isBulkEventSurplus: Boolean(isBulkEventSurplus),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Listing published successfully",
        listing: {
          ...listing,
          allergens,
          dietaryTags,
          pickupStartTime: listing.pickupStartTime.toISOString().substring(11, 16),
          pickupEndTime: listing.pickupEndTime.toISOString().substring(11, 16),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create listing" },
      { status: 500 }
    );
  }
}
