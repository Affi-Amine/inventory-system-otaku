"use client"

import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
// import { useTheme } from "@/components/theme-provider"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
      backgroundColor: "rgb(99, 102, 241)",
    },
  ],
}

export type ChartData = typeof defaultData

export function OverviewChart({ data = defaultData }: { data?: ChartData }) {
  // const { theme } = useTheme()

  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
  //       backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgb(99, 102, 241)",
  //     },
  //   ],
  // }

  return (
    <div className="chart-container p-4 rounded-lg">
      <Bar options={options} data={data} height={300} />
    </div>
  )
}
