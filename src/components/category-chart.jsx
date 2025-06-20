"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const colors = ["#adfa1d", "#84cc16", "#65a30d", "#4d7c0f", "#365314"]

export function CategoryChart({ data = {} }) {
  // Transform status breakdown data to chart format
  const chartData = Object.entries(data).map(([status, count], index) => ({
    name: status,
    value: count,
    color: colors[index % colors.length],
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name} ${total > 0 ? ((value / total) * 100).toFixed(0) : 0}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "Orders"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
