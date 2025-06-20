"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export function Overview({ data = [] }) {
  // Transform the API data to match the chart format
  const transformData = (dailyStats) => {
    if (!dailyStats || dailyStats.length === 0) {
      return []
    }

    return dailyStats
      .map((stat) => {
        const date = new Date(stat.date)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        return {
          name: `${monthNames[date.getMonth()]} ${date.getDate()}`,
          total: stat.revenue,
          orders: stat.orders,
        }
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const chartData = transformData(data)

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-center text-muted-foreground">No sales data available</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === "total") return [`₹${value}`, "Revenue"]
            return [value, name]
          }}
          labelStyle={{ color: "#000" }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
