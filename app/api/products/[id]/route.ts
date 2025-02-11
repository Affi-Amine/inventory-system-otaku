import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    const json = await request.json()
    const product = await prisma.product.update({
      where: { id: params.id },
      data: json,
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!params?.id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    const product = await prisma.product.delete({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: "Failed to delete product",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

