import { NextResponse } from "next/server"
import { prisma } from "../../../lib/db"

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { name, email, phone } = json
    
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        deleted: false // Explicitly set deleted status
      },
    })
    
    return NextResponse.json(customer)
  } catch (_) {
    console.error("Error creating customer:")
    return NextResponse.json(
      { error: "Failed to create customer" }, 
      { status: 500 }
    )
  }
}