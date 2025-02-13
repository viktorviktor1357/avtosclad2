"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Янв", sales: 4000, purchases: 2400 },
  { name: "Фев", sales: 3000, purchases: 1398 },
  { name: "Мар", sales: 2000, purchases: 9800 },
  { name: "Апр", sales: 2780, purchases: 3908 },
  { name: "Май", sales: 1890, purchases: 4800 },
  { name: "Июн", sales: 2390, purchases: 3800 },
]

export function SalesAndPurchasesChart() {
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

