'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const labels = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

type ChartData = {
  month: number
  total: number
}[]

export function OverviewChart({ data }: { data: ChartData }) {
  const chartData = {
    labels,
    datasets: [
      {
        data: labels.map((_, index) => {
          const monthData = data.find(d => d.month === index + 1)
          return monthData?.total || 0
        }),
        backgroundColor: 'rgb(99, 102, 241)',
      },
    ],
  }

  return <Bar options={options} data={chartData} height={300} />
}