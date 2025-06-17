"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { year: "2021", growth: 25.0 },
  { year: "2022", growth: 20.0 },
  { year: "2023", growth: 14.3 },
  { year: "2024", growth: 16.7 },
]

export function GrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip formatter={(value) => [`${value}%`, "Growth Rate"]} labelStyle={{ color: "#000" }} />
        <Line
          type="monotone"
          dataKey="growth"
          stroke="#adfa1d"
          strokeWidth={3}
          dot={{ fill: "#adfa1d", strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
