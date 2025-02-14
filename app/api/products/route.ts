import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Fetch all products, excluding deleted ones
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { deleted: false }, // Exclude archived products
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}