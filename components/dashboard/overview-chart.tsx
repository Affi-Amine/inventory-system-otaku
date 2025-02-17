"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      type: "linear" as const,
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        callback: (value) => `${value.toLocaleString()} TND`,
      },
    },
    x: {
      type: "category" as const,
      grid: {
        display: false,
      },
    },
  },
}

interface SalesData {
  month: string
  total: number
}

export function OverviewChart() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await fetch("/api/analytics/sales")
        if (!response.ok) {
          throw new Error("Failed to fetch sales data")
        }
        const data = await response.json()
        setSalesData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching sales data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [])

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>
  }

  const data = {
    labels: salesData.map((item) => item.month),
    datasets: [
      {
        data: salesData.map((item) => item.total),
        backgroundColor: "rgb(99, 102, 241)",
        borderRadius: 4,
      },
    ],
  }

  return (
    <div className="chart-container p-4 rounded-lg">
      <Bar options={options} data={data} height={300} />
    </div>
  )
}

