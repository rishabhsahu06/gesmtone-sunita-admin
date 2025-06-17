"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Download, FileText, BarChart3, Users, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState(null)
  const { toast } = useToast()

  const generateReport = (type, format) => {
    // Mock report generation
    toast({
      title: "Report Generated",
      description: `${type} report has been generated and downloaded as ${format}.`,
    })

    // Simulate file download
    const filename = `${type.toLowerCase().replace(" ", "_")}_report.${format.toLowerCase()}`
    const element = document.createElement("a")
    element.href = "data:text/plain;charset=utf-8," + encodeURIComponent("Sample report data")
    element.download = filename
    element.click()
  }

  const reportTypes = [
    {
      id: "sales",
      title: "Sales Report",
      description: "Comprehensive sales data and analytics",
      icon: BarChart3,
    },
    {
      id: "products",
      title: "Product Report",
      description: "Product inventory and performance metrics",
      icon: Package,
    },
    {
      id: "customers",
      title: "Customer Report",
      description: "Customer data and behavior analysis",
      icon: Users,
    },
    {
      id: "consultations",
      title: "Consultations Report",
      description: "Consultation requests and completion rates",
      icon: FileText,
    },
  ]

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
              <report.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{report.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
          <CardDescription>Create and download custom reports with specific parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="products">Product Report</SelectItem>
                  <SelectItem value="customers">Customer Report</SelectItem>
                  <SelectItem value="consultations">Consultations Report</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => generateReport(reportType || "General", "CSV")} disabled={!reportType}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
            <Button
              onClick={() => generateReport(reportType || "General", "Excel")}
              disabled={!reportType}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
            <Button
              onClick={() => generateReport(reportType || "General", "PDF")}
              disabled={!reportType}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Export Options</CardTitle>
          <CardDescription>Export data from different sections of the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Product Data</h4>
              <p className="text-sm text-muted-foreground">Export all product information</p>
              <Button size="sm" variant="outline" onClick={() => generateReport("Products", "CSV")}>
                Export Products
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Order History</h4>
              <p className="text-sm text-muted-foreground">Export complete order history</p>
              <Button size="sm" variant="outline" onClick={() => generateReport("Orders", "CSV")}>
                Export Orders
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Consultation Requests</h4>
              <p className="text-sm text-muted-foreground">Export all consultation data</p>
              <Button size="sm" variant="outline" onClick={() => generateReport("Consultations", "CSV")}>
                Export Consultations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
