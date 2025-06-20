"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export function GrowthChart({ data = [] }) {
  // Transform and calculate growth data
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))

  const chartData = sortedData.map((item, index) => {
    let growth = 0
    if (index > 0) {
      const prevRevenue = sortedData[index - 1].revenue
      const currentRevenue = item.revenue
      if (prevRevenue > 0) {
        growth = ((currentRevenue - prevRevenue) / prevRevenue) * 100
      }
    }

    return {
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      growth: Number.parseFloat(growth.toFixed(1)),
      revenue: item.revenue,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
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
