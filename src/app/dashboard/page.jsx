"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Package, ShoppingCart, Phone, TrendingUp } from "lucide-react";
import { analyticsAPI } from "@/lib/api";
import useAccessToken from "@/hooks/useSession";
import DashboardSkeleton from "@/components/skeleton/dashboardSkeleton";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken, status } = useAccessToken();

  useEffect(() => {
    if (status === "loading") return;
    if (!accessToken) {
      setLoading(false);
      setError("Authentication required");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsAPI.getSalesData(accessToken);

        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("Error fetching dashboard data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [accessToken, status]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard Overview
        </h2>
        <div className="text-red-500 text-center p-4 break-words">{error}</div>
      </div>
    );
  }

  const { overview, growth, recentOrders, dailyStats } = dashboardData;

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {overview.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {growth.ordersGrowthRate > 0 ? "+" : ""}
              {growth.ordersGrowthRate}% from last year
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {overview.totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {growth.ordersGrowthRate > 0 ? "+" : ""}
              {growth.ordersGrowthRate}% from last year
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {overview.totalBookingCalls}
            </div>
            <p className="text-xs text-muted-foreground">
              Booking calls this period
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              ₹{overview.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {growth.revenueGrowthRate > 0 ? "+" : ""}
              {growth.revenueGrowthRate}% from last year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="min-w-0 col-span-1 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden px-2 sm:px-6">
            <Overview data={dailyStats} />
          </CardContent>
        </Card>

        <Card className="min-w-0 col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made {overview.monthlyOrders} sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <RecentSales data={recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
