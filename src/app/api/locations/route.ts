import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const countryCode = searchParams.get("countryCode");
    const type = searchParams.get("type");

    const where: any = {};
    if (city && city !== "All Locations") {
      where.city = { contains: city };
    }
    if (countryCode) {
      where.countryCode = countryCode;
    }
    if (type && type !== "all") {
      where.type = type;
    }

    const locations = await prisma.communityLocation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        inventory: {
          select: {
            id: true,
            itemName: true,
            quantity: true,
            unit: true,
            lastUpdated: true,
          },
        },
        needs: {
          select: {
            id: true,
            itemName: true,
            urgencyLevel: true,
            fulfilled: true,
          },
        },
      },
    });

    const formattedLocations = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      type: loc.type,
      city: loc.city,
      country: loc.country,
      countryCode: loc.countryCode,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      operatingHours: loc.operatingHours || "24/7 Access",
      isVerified: loc.isVerified,
      currentStockLevel: loc.currentStockLevel || "Moderate",
      capacityNotes: loc.capacityNotes,
      contactPhone: loc.contactPhone,
      inventory: loc.inventory,
      needs: loc.needs,
    }));

    return NextResponse.json({
      success: true,
      count: formattedLocations.length,
      locations: formattedLocations,
    });
  } catch (error: any) {
    console.error("GET /api/locations error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch community locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type = "community_fridge",
      address,
      city,
      country = "India",
      countryCode = "IN",
      latitude,
      longitude,
      operatingHours = "24/7 Public Access",
      contactPhone,
      currentStockLevel = "Moderate",
      capacityNotes,
    } = body;

    if (!name || !address) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, address" },
        { status: 400 }
      );
    }

    const newLocation = await prisma.communityLocation.create({
      data: {
        name,
        type,
        address,
        city: city || "Kolkata",
        country,
        countryCode,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        operatingHours,
        contactPhone: contactPhone || null,
        currentStockLevel,
        capacityNotes: capacityNotes || null,
        isVerified: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Community location registered successfully",
        location: newLocation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/locations error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to register location" },
      { status: 500 }
    );
  }
}
