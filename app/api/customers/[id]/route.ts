import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/db"

type RouteContext = {
    params: { id: string }
  }
  
  export async function PATCH(request: Request, { params }: RouteContext) {
    try {
      if (!params?.id) {
        return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
      }
  
      const json = await request.json()
      const { name, email, phone } = json
      const customer = await prisma.customer.update({
        where: { id: params.id },
        data: {
          name,
          email,
          phone,
        },
      })
  
      return NextResponse.json(customer)
    } catch (error) {
      console.error("Error updating customer:", error)
      return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
    }
  }
  
  export async function DELETE(request: Request, { params }: RouteContext) {
    try {
      if (!params?.id) {
        return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
      }
  
      const customer = await prisma.customer.delete({
        where: { id: params.id },
      })
  
      return NextResponse.json({ success: true, customer })
    } catch (error) {
      console.error("Error deleting customer:", error)
      return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
    }
  }
  
  