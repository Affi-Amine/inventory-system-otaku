import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { OrderItem: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if the product is associated with any orders
    if (product.OrderItem.length > 0) {
      return NextResponse.json({ error: "Cannot delete product as it is associated with orders" }, { status: 400 })
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

