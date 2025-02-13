"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const defaultData = {
  labels: ["In Stock", "Low Stock", "Out of Stock"],
  datasets: [
    {
      data: [63, 15, 22],
      backgroundColor: ["rgb(34, 197, 94)", "rgb(234, 179, 8)", "rgb(239, 68, 68)"],
      borderWidth: 0,
    },
  ],
}

export type StockData = typeof defaultData

export function StockStatus({ data = defaultData }: { data?: StockData }) {
  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  }

  return (
    <div className="chart-container p-4 rounded-lg">
      <Doughnut data={data} options={options} />
    </div>
  )
}

