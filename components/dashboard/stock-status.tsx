'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

type StockData = {
  inStock: number
  lowStock: number
  outOfStock: number
}

const options = {
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

export function StockStatus({ data }: { data: StockData }) {
  const chartData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [data.inStock, data.lowStock, data.outOfStock],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 0,
      },
    ],
  }

  return <Doughnut data={chartData} options={options} />
}