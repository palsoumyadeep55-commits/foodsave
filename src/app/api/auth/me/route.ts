import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        donorProfile: true,
        ngoProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        primaryRole: user.primaryRole,
        phoneNumber: user.phoneNumber,
        city: user.city,
        organizationName:
          user.donorProfile?.businessName ||
          user.ngoProfile?.organizationName ||
          user.organizationName,
      },
    });
  } catch (error: any) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}
