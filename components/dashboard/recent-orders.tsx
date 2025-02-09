import { prisma } from "@/lib/db"

export async function RecentOrders() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
    },
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-3 text-left">Order ID</th>
            <th className="pb-3 text-left">Customer</th>
            <th className="pb-3 text-left">Date</th>
            <th className="pb-3 text-left">Status</th>
            <th className="pb-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-3">{order.id.slice(-6)}</td>
              <td className="py-3">{order.customer.name}</td>
              <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status.toLowerCase()}
                </span>
              </td>
              <td className="py-3 text-right">${order.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

