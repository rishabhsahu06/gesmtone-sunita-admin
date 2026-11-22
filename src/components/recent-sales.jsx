"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales({ data = [] }) {
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "NA";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const recentOrders = data.slice(0, 5);

  if (!data || data.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center text-sm text-muted-foreground">
          No recent sales data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {recentOrders.map((order) => (
        <div key={order?._id} className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage
              src="/placeholder.svg?height=36&width=36"
              alt="Avatar"
            />
            <AvatarFallback>{getInitials(order?.user?.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-medium leading-none">
              {order?.user?.name || "Customer"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {order?.user?.email || "—"}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm font-medium whitespace-nowrap">
              +₹{(order?.totalAmount ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(order?.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
