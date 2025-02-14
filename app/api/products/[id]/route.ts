import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { params } = context; // Await not required here

  if (!params?.id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { OrderItem: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.OrderItem.length > 0) {
      await prisma.product.update({
        where: { id: params.id },
        data: { deleted: true },
      });
      return NextResponse.json({ success: true, message: "Product archived successfully" });
    }

    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}