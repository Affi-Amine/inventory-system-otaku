import { prisma } from "../../../lib/db"
import { CustomerList } from "../../../components/dashboard/customers/customer-list"
import { AddCustomerButton } from "../../../components/dashboard/customers/add-customer-button"
import React from "react"

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orders: true,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <AddCustomerButton />
      </div>
      <CustomerList initialCustomers={customers} />
    </div>
  )
}

export const dynamic = "force-dynamic"

