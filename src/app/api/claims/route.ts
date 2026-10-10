import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate a random 6-digit verification code e.g. "FS-482910"
function generateVerificationCode(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `FS-${digits}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    const claimerId = searchParams.get("claimerId");
    const status = searchParams.get("status");

    const where: any = {};
    if (listingId) where.listingId = listingId;
    if (claimerId) where.claimerId = claimerId;
    if (status && status !== "all") where.status = status;

    const claims = await prisma.listingClaim.findMany({
      where,
      orderBy: { claimedAt: "desc" },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            donorName: true,
            donorCity: true,
            donorAddress: true,
            quantity: true,
            category: true,
            price: true,
            currencySymbol: true,
            status: true,
            expiryTime: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error: any) {
    console.error("GET /api/claims error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch claims" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      listingId,
      claimerName,
      claimerEmail,
      claimerPhone,
      claimerRole = "individual",
      pickupSlot,
      notes,
    } = body;

    if (!listingId || !claimerName || !pickupSlot) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: listingId, claimerName, pickupSlot" },
        { status: 400 }
      );
    }

    // Verify listing exists and is available
    const listing = await prisma.foodListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.status !== "active") {
      return NextResponse.json(
        { success: false, error: `Listing is already ${listing.status}` },
        { status: 409 }
      );
    }

    const verificationCode = generateVerificationCode();

    // Create the claim and mark listing as claimed
    const [claim] = await prisma.$transaction([
      prisma.listingClaim.create({
        data: {
          listingId,
          claimerName,
          claimerEmail: claimerEmail || null,
          claimerPhone: claimerPhone || null,
          claimerRole,
          pickupSlot,
          notes: notes || null,
          status: "pending",
          verificationCode,
        },
      }),
      prisma.foodListing.update({
        where: { id: listingId },
        data: { status: "claimed" },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Claim submitted successfully. Please show your verification code at pickup.",
        claim: {
          ...claim,
          listingTitle: listing.title,
          donorName: listing.donorName,
          donorAddress: listing.donorAddress,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/claims error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit claim" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, status, verificationCodeInput } = body;

    if (!claimId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing claimId or status" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "approved", "fulfilled", "rejected", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const claim = await prisma.listingClaim.findUnique({
      where: { id: claimId },
      include: { listing: true },
    });

    if (!claim) {
      return NextResponse.json(
        { success: false, error: "Claim record not found" },
        { status: 404 }
      );
    }

    // If marking as fulfilled, verify the pickup code
    if (status === "fulfilled" && verificationCodeInput) {
      const cleanInput = verificationCodeInput.trim().toUpperCase();
      const actualCode = claim.verificationCode.trim().toUpperCase();
      if (cleanInput !== actualCode) {
        return NextResponse.json(
          { success: false, error: "Invalid verification code. Pickup verification failed." },
          { status: 400 }
        );
      }
    }

    // Determine listing status updates
    let updatedListingStatus: string | null = null;
    if (status === "fulfilled") {
      updatedListingStatus = "completed";
    } else if (status === "rejected" || status === "cancelled") {
      updatedListingStatus = "active"; // make available again
    } else if (status === "approved") {
      updatedListingStatus = "claimed";
    }

    const [updatedClaim] = await prisma.$transaction([
      prisma.listingClaim.update({
        where: { id: claimId },
        data: { status },
      }),
      ...(updatedListingStatus
        ? [
            prisma.foodListing.update({
              where: { id: claim.listingId },
              data: { status: updatedListingStatus },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      success: true,
      message: `Claim status transitioned to '${status}' successfully`,
      claim: updatedClaim,
    });
  } catch (error: any) {
    console.error("PATCH /api/claims error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update claim" },
      { status: 500 }
    );
  }
}
