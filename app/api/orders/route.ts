import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { OrderStatus } from "../../../components/dashboard/orders/types";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { customerId, items }: { customerId: string; items: Array<{ productId: string; quantity: number }> } = json;

    let total = 0;
    const orderItems: Array<{ productId: string; quantity: number; price: number }> = [];

    // Validate items and calculate total
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      if (product.deleted) {
        return NextResponse.json({ error: `Product is deleted: ${product.name}` }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for product: ${product.name}` }, { status: 400 });
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Update product stock
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity },
      });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId,
        total,
        status: OrderStatus.PENDING,
        items: {
          create: orderItems,
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}