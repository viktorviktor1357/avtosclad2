"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DataItem {
  name: string
  sales: number
  purchases: number
}

interface ReportsChartProps {
  data: DataItem[]
}

export default function ReportsChart({ data }: ReportsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sales" fill="#8884d8" name="Продажи" />
        <Bar dataKey="purchases" fill="#82ca9d" name="Закупки" />
      </BarChart>
    </ResponsiveContainer>
  )
}

