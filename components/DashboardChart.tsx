"use client"

import dynamic from "next/dynamic"

const DynamicBarChart = dynamic(() => import("./DynamicBarChart"), { ssr: false })

interface DataItem {
  name: string
  value: number
}

interface DashboardChartProps {
  data: DataItem[]
}

export default function DashboardChart({ data }: DashboardChartProps) {
  return <DynamicBarChart data={data} />
}

