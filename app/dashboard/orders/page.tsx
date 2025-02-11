import { prisma } from "../../../lib/db"
import { OrderList } from "../../../components/dashboard/orders/order-list"
import { AddOrderButton } from "../../../components/dashboard/orders/add-order-button"
import React from "react"

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  const customers = await prisma.customer.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const products = await prisma.product.findMany({
    where: {
      stock: {
        gt: 0,
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <AddOrderButton customers={customers} products={products} />
      </div>
      <OrderList initialOrders={orders} />
    </div>
  )
}

export const dynamic = "force-dynamic"

