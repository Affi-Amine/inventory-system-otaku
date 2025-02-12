import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { stringify } from "csv-stringify/sync"

export async function GET() {
  try {
    const products = await prisma.product.findMany()
    const customers = await prisma.customer.findMany()
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    const productsCsv = stringify(products, { header: true })
    const customersCsv = stringify(customers, { header: true })
    const ordersCsv = stringify(
      orders.map((order) => ({
        id: order.id,
        customerId: order.customerId,
        customerName: order.customer.name,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map((item) => `${item.quantity}x ${item.product.name}`).join(", "),
      })),
      { header: true },
    )

    const csv = `Products\n${productsCsv}\n\nCustomers\n${customersCsv}\n\nOrders\n${ordersCsv}`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=inventory-data.csv",
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}

