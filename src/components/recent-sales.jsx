"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales({ data = [] }) {
  // Helper function to get initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Show only first 5 recent orders
  const recentOrders = data.slice(0, 5)

  if (!data || data.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center text-muted-foreground">No recent sales data available</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div key={order._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
            <AvatarFallback>{getInitials(order.user.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.user.name}</p>
            <p className="text-sm text-muted-foreground">{order.user.email}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="font-medium">+₹{order.totalAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
