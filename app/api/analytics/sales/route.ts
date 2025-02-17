import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths } from "date-fns"

export async function GET() {
  try {
    // Get the last 12 months
    const endDate = new Date()
    const startDate = subMonths(endDate, 11) // 11 months ago to include current month

    // Generate array of all months in the interval
    const months = eachMonthOfInterval({ start: startDate, end: endDate })

    // Get sales data for each month
    const salesData = await Promise.all(
      months.map(async (month) => {
        const start = startOfMonth(month)
        const end = endOfMonth(month)

        const result = await prisma.order.aggregate({
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
          _sum: {
            total: true,
          },
        })

        return {
          month: format(month, "MMM"),
          total: result._sum.total || 0,
        }
      }),
    )

    return NextResponse.json(salesData)
  } catch (error) {
    console.error("Error fetching sales data:", error)
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 })
  }
}

