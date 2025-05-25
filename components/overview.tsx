"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Ene",
    total: 1800,
  },
  {
    name: "Feb",
    total: 2200,
  },
  {
    name: "Mar",
    total: 2800,
  },
  {
    name: "Abr",
    total: 2400,
  },
  {
    name: "May",
    total: 2900,
  },
  {
    name: "Jun",
    total: 3300,
  },
  {
    name: "Jul",
    total: 3200,
  },
  {
    name: "Ago",
    total: 3500,
  },
  {
    name: "Sep",
    total: 3800,
  },
  {
    name: "Oct",
    total: 4200,
  },
  {
    name: "Nov",
    total: 4600,
  },
  {
    name: "Dic",
    total: 5100,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
