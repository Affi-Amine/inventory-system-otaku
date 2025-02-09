import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { DollarSign, Users, Package, TrendingUp } from 'lucide-react'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import { StockStatus } from '@/components/dashboard/stock-status'
import { RecentOrders } from '@/components/dashboard/recent-orders'

async function getOverviewData() {
  // Get monthly sales data
  const monthlyData = await prisma.$queryRaw<{ month: number, total: number }[]>`
    SELECT 
      EXTRACT(MONTH FROM "createdAt")::integer as month,
      SUM(total) as total
    FROM "Order"
    WHERE 
      "createdAt" >= DATE_TRUNC('year', CURRENT_DATE)
    GROUP BY month
    ORDER BY month
  `

  // Get stock status
  const products = await prisma.product.findMany()
  const stockStatus = {
    inStock: products.filter(p => p.stock > 10).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  }

  // Get overview stats
  const totalProducts = await prisma.product.count()
  const totalCustomers = await prisma.customer.count()
  const totalOrders = await prisma.order.count()
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true
    }
  })

  return {
    monthlyData,
    stockStatus,
    stats: {
      products: totalProducts,
      customers: totalCustomers,
      orders: totalOrders,
      revenue: totalRevenue._sum.total || 0
    }
  }
}

export default async function DashboardPage() {
  const { monthlyData, stockStatus, stats } = await getOverviewData()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-semibold">
                  ${stats.revenue.toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <h3 className="text-2xl font-semibold">{stats.customers}</h3>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <h3 className="text-2xl font-semibold">{stats.products}</h3>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-semibold">{stats.orders}</h3>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
            <OverviewChart data={monthlyData} />
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stock Status</h3>
            <StockStatus data={stockStatus} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <RecentOrders />
        </div>
      </Card>
    </div>
  )
}