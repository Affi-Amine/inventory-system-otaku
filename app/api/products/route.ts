import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Fetch all products, excluding deleted ones
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { deleted: false }, // Exclude archived products
    });
    return NextResponse.json(products);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching products:", errorMessage);

    return NextResponse.json(
      { error: "Failed to fetch products", details: errorMessage },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const product = await prisma.product.create({
      data: json,
    });
    return NextResponse.json(product);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating product:", errorMessage);

    // Handle Prisma errors (e.g., unique constraints, invalid data)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error", code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product", details: errorMessage },
      { status: 500 }
    );
  }
}