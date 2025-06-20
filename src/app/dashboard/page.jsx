"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Package, ShoppingCart, Phone, TrendingUp } from "lucide-react"
import { analyticsAPI } from "@/lib/api"
import useAccessToken from "@/hooks/useSession"

// Mock analyticsAPI (replace with your actual API)


export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 const { accessToken } = useAccessToken()
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Replace with your actual access token logic
        const response = await analyticsAPI.getSalesData(accessToken)

        if (response.data.success) {
          setDashboardData(response.data.data)
        } else {
          setError("Failed to fetch dashboard data")
        }
      } catch (err) {
        setError("Error fetching dashboard data: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        </div>
        <div className="text-red-500 text-center p-4">{error}</div>
      </div>
    )
  }

  const { overview, growth, recentOrders, dailyStats } = dashboardData

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {growth.ordersGrowthRate > 0 ? "+" : ""}
              {growth.ordersGrowthRate}% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {growth.ordersGrowthRate > 0 ? "+" : ""}
              {growth.ordersGrowthRate}% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalBookingCalls}</div>
            <p className="text-xs text-muted-foreground">Booking calls this period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{overview.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {growth.revenueGrowthRate > 0 ? "+" : ""}
              {growth.revenueGrowthRate}% from last year
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={dailyStats} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made {overview.monthlyOrders} sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales data={recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
