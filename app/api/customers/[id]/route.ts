import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/db"
import { Prisma } from "@prisma/client"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    if (!params?.id) {
      return NextResponse.json(
        { error: "Customer ID is required" }, 
        { status: 400 }
      )
    }

    // Check customer existence
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: params.id }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" }, 
        { status: 404 }
      )
    }

    // Check for existing orders
    const orders = await prisma.order.findMany({
      where: { customerId: params.id }
    })

    if (orders.length > 0) {
      return NextResponse.json(
        { error: "Customer has active orders" },
        { status: 400 }
      )
    }

    // Soft delete
    const updatedCustomer = await prisma.customer.update({
      where: { id: params.id },
      data: { deleted: true }
    })

    return NextResponse.json({
      success: true,
      customer: updatedCustomer
    })

  } catch (error: unknown) {
    // Handle error logging safely
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Delete customer error:", errorMessage)

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error", code: error.code },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const json = await request.json();
    const { name, email, phone } = json;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate customer exists and isn't deleted
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: params.id }
    });

    if (!existingCustomer || existingCustomer.deleted) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone: phone || null,
      },
    });

    return NextResponse.json(updatedCustomer);

  } catch (error: any) {
    console.error("Error updating customer:", error);

    // Handle duplicate email error
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update customer", details: error.message },
      { status: 500 }
    );
  }
}