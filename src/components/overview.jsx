"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export function Overview({ data = [] }) {
  const transformData = (dailyStats) => {
    if (!dailyStats || dailyStats.length === 0) {
      return [];
    }

    return dailyStats
      .map((stat) => {
        const date = new Date(stat.date);
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return {
          name: `${monthNames[date.getMonth()]} ${date.getDate()}`,
          total: stat.revenue,
          orders: stat.orders,
          sortDate: date.getTime(),
        };
      })
      .sort((a, b) => a.sortDate - b.sortDate);
  };

  const chartData = transformData(data);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center sm:h-[300px] lg:h-[350px]">
        <div className="text-center text-muted-foreground text-sm">
          No sales data available
        </div>
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full min-w-0 sm:h-[300px] lg:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            stroke="#888888"
            fontSize={11}
            width={48}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              value >= 1000 ? `₹${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : `₹${value}`
            }
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "total") return [`₹${value}`, "Revenue"];
              return [value, name];
            }}
            labelStyle={{ color: "#000" }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Bar dataKey="total" fill="#2d8bba" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
