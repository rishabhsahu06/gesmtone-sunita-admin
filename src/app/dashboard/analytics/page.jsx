"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesChart } from "@/components/sales-chart";
import { GrowthChart } from "@/components/growth-chart";
import { CategoryChart } from "@/components/category-chart";
import { TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import useAccessToken from "@/hooks/useSession";
import { analyticsAPI } from "@/lib/api";

export default function AnalyticsPage() {
  const { accessToken } = useAccessToken();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytic = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getSalesData(accessToken);
      console.log(response);
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchAnalytic();
    }
  }, [accessToken]);

  // Calculate growth rate from daily stats
  const calculateGrowthRate = () => {
    if (!analyticsData?.dailyStats || analyticsData.dailyStats.length < 2)
      return 0;
    const sortedStats = [...analyticsData.dailyStats].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const firstRevenue = sortedStats[0]?.revenue || 0;
    const lastRevenue = sortedStats[sortedStats.length - 1]?.revenue || 0;
    if (firstRevenue === 0) return 0;
    return (((lastRevenue - firstRevenue) / firstRevenue) * 100).toFixed(1);
  };

  if (loading) {
    return <div className="flex-1 space-y-4">Loading...</div>;
  }

  if (!analyticsData) {
    return <div className="flex-1 space-y-4">Error loading data</div>;
  }

  const { overview, dailyStats, statusBreakdown } = analyticsData;
  const growthRate = calculateGrowthRate();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{overview.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Monthly revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              {overview.weeklyOrders} this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{overview.avgOrderValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Average order value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{growthRate}%</div>
            <p className="text-xs text-muted-foreground">Period over period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
            <CardDescription>Revenue by date</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={dailyStats} />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Daily Growth</CardTitle>
            <CardDescription>Revenue trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthChart data={dailyStats} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
          <CardDescription>Orders by status</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryChart data={statusBreakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
