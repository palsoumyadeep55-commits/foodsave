import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, role = "individual", phoneNumber, city, organizationName, address } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { success: false, error: "Email and Full Name are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash("foodsave123", 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        fullName,
        primaryRole: role,
        phoneNumber: phoneNumber || null,
        city: city || null,
        organizationName: organizationName || null,
      },
    });

    // Create role-specific profile if donor or ngo
    if (role === "donor") {
      await prisma.donorProfile.create({
        data: {
          userId: newUser.id,
          businessName: organizationName || `${fullName}'s Kitchen`,
          address: address || `${city || "Local"} Food Hub`,
          isVerified: true,
        },
      });
    } else if (role === "ngo") {
      await prisma.ngoProfile.create({
        data: {
          userId: newUser.id,
          organizationName: organizationName || `${fullName} Charity Network`,
          address: address || `${city || "Local"} Distribution Center`,
          isVerified: true,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          primaryRole: newUser.primaryRole,
          city: newUser.city,
          organizationName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
