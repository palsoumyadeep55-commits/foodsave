import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const category = searchParams.get("category");

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (category && category !== "all") {
      where.category = category;
    }

    // Default: fetch active items not yet consumed or discarded
    const items = await prisma.fridgeIngredient.findMany({
      where: {
        ...where,
        consumedAt: null,
        discardedAt: null,
      },
      orderBy: { expiryDate: "asc" },
    });

    const formatted = items.map((item) => ({
      ...item,
      expiryDate: item.expiryDate.toISOString().split("T")[0],
      addedAt: item.addedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      ingredients: formatted,
    });
  } catch (error: any) {
    console.error("GET /api/fridge error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch fridge items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category = "produce", quantity = 1, unit = "items", expiryDate, userId } = body;

    if (!name || !expiryDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, expiryDate" },
        { status: 400 }
      );
    }

    // Associate with existing demo user if userId not passed
    let assignedUserId = userId;
    if (!assignedUserId) {
      const demoUser = await prisma.user.findFirst({
        where: { primaryRole: "individual" },
      });
      assignedUserId = demoUser?.id;
    }

    const newItem = await prisma.fridgeIngredient.create({
      data: {
        name: name.trim(),
        category,
        quantity: parseFloat(quantity) || 1,
        unit: unit.trim(),
        expiryDate: new Date(expiryDate),
        userId: assignedUserId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ingredient added to fridge",
        ingredient: {
          ...newItem,
          expiryDate: newItem.expiryDate.toISOString().split("T")[0],
          addedAt: newItem.addedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/fridge error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to add fridge item" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, quantity } = body; // action: "consume" | "discard" | "update"

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing ingredient id" },
        { status: 400 }
      );
    }

    let updateData: any = {};
    if (action === "consume") {
      updateData.consumedAt = new Date();
    } else if (action === "discard") {
      updateData.discardedAt = new Date();
    } else if (quantity !== undefined) {
      updateData.quantity = parseFloat(quantity);
    }

    const updated = await prisma.fridgeIngredient.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Item updated (${action || "quantity"})`,
      ingredient: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/fridge error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing ingredient id" },
        { status: 400 }
      );
    }

    await prisma.fridgeIngredient.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Ingredient removed from fridge",
    });
  } catch (error: any) {
    console.error("DELETE /api/fridge error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete item" },
      { status: 500 }
    );
  }
}
