import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order with its items
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Restore product stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Soft delete the order
    const deletedOrder = await prisma.order.update({
      where: { id },
      data: { deleted: true },
    });

    return NextResponse.json({
      success: true,
      message: "Order soft deleted successfully",
      order: deletedOrder,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order", details: errorMessage },
      { status: 500 }
    );
  }
}