import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

type RouteContext = {
  params: {
    id: string
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const json = await request.json()
    const product = await prisma.product.update({
      where: { id: String(params.id) },
      data: json,
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const product = await prisma.product.delete({
      where: { id: String(params.id) },
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
      { status: 500 }
    )
  }
}