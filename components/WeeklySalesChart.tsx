"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Пн", value: 400 },
  { name: "Вт", value: 300 },
  { name: "Ср", value: 500 },
  { name: "Чт", value: 280 },
  { name: "Пт", value: 590 },
  { name: "Сб", value: 320 },
  { name: "Вс", value: 250 },
]

export function WeeklySalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

