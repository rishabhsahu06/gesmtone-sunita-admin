"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, Phone, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([])
  const [filteredConsultations, setFilteredConsultations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const { toast } = useToast()

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockConsultations = [
      {
        id: "CONS-001",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1 (555) 123-4567",
        company: "Tech Solutions Inc.",
        service: "Business Strategy",
        preferredDate: "2024-01-20",
        preferredTime: "10:00 AM",
        message: "Looking for help with digital transformation strategy for our company.",
        status: "pending",
        submittedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "CONS-002",
        name: "Michael Chen",
        email: "michael@example.com",
        phone: "+1 (555) 987-6543",
        company: "StartupXYZ",
        service: "Product Development",
        preferredDate: "2024-01-22",
        preferredTime: "2:00 PM",
        message: "Need guidance on product roadmap and development process.",
        status: "scheduled",
        submittedAt: "2024-01-14T14:15:00Z",
      },
      {
        id: "CONS-003",
        name: "Emily Rodriguez",
        email: "emily@example.com",
        phone: "+1 (555) 456-7890",
        company: "Marketing Pro",
        service: "Marketing Strategy",
        preferredDate: "2024-01-18",
        preferredTime: "11:30 AM",
        message: "Want to discuss digital marketing strategies for B2B companies.",
        status: "completed",
        submittedAt: "2024-01-12T09:45:00Z",
      },
      {
        id: "CONS-004",
        name: "David Kim",
        email: "david@example.com",
        phone: "+1 (555) 321-0987",
        company: "Innovation Labs",
        service: "Technology Consulting",
        preferredDate: "2024-01-25",
        preferredTime: "3:30 PM",
        message: "Seeking advice on implementing AI solutions in our workflow.",
        status: "cancelled",
        submittedAt: "2024-01-13T16:20:00Z",
      },
      {
        id: "CONS-005",
        name: "Lisa Thompson",
        email: "lisa@example.com",
        phone: "+1 (555) 654-3210",
        company: "Growth Ventures",
        service: "Business Strategy",
        preferredDate: "2024-01-19",
        preferredTime: "9:00 AM",
        message: "Need help with scaling our business operations.",
        status: "pending",
        submittedAt: "2024-01-16T11:10:00Z",
      },
    ]
    setConsultations(mockConsultations)
    setFilteredConsultations(mockConsultations)
  }, [])

  useEffect(() => {
    let filtered = consultations.filter(
      (consultation) =>
        consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((consultation) => consultation.status === statusFilter)
    }

    setFilteredConsultations(filtered)
  }, [searchTerm, statusFilter, consultations])

  const updateConsultationStatus = async (consultationId, newStatus) => {
    try {
      // Replace with actual API call
      // await axios.put(`/api/consultations/${consultationId}`, { status: newStatus })

      setConsultations(
        consultations.map((consultation) =>
          consultation.id === consultationId ? { ...consultation, status: newStatus } : consultation,
        ),
      )

      toast({
        title: "Consultation updated",
        description: `Consultation status changed to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update consultation status.",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Service", "Preferred Date", "Status", "Submitted At"]
    const csvContent = [
      headers.join(","),
      ...filteredConsultations.map((consultation) =>
        [
          consultation.id,
          `"${consultation.name}"`,
          consultation.email,
          consultation.phone,
          `"${consultation.company}"`,
          `"${consultation.service}"`,
          consultation.preferredDate,
          consultation.status,
          consultation.submittedAt,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "consultations.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "default"
      case "scheduled":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Consultation Calls</h2>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
            <p className="text-xs text-muted-foreground">All consultation requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.filter((c) => c.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.filter((c) => c.status === "scheduled").length}</div>
            <p className="text-xs text-muted-foreground">Confirmed meetings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.filter((c) => c.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Finished consultations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consultation Management</CardTitle>
          <CardDescription>View and manage consultation call requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{consultation.name}</div>
                        <div className="text-sm text-muted-foreground">{consultation.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{consultation.company}</TableCell>
                    <TableCell>{consultation.service}</TableCell>
                    <TableCell>
                      <div>
                        <div>{formatDate(consultation.preferredDate)}</div>
                        <div className="text-sm text-muted-foreground">{consultation.preferredTime}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(consultation.status)}>{consultation.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedConsultation(consultation)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Consultation Details - {selectedConsultation?.id}</DialogTitle>
                            <DialogDescription>Complete consultation request information</DialogDescription>
                          </DialogHeader>
                          {selectedConsultation && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Name</p>
                                  <p className="text-sm text-muted-foreground">{selectedConsultation.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Email</p>
                                  <p className="text-sm text-muted-foreground">{selectedConsultation.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Phone</p>
                                  <p className="text-sm text-muted-foreground">{selectedConsultation.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Company</p>
                                  <p className="text-sm text-muted-foreground">{selectedConsultation.company}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Service</p>
                                  <p className="text-sm text-muted-foreground">{selectedConsultation.service}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Submitted</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDateTime(selectedConsultation.submittedAt)}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Preferred Date & Time</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(selectedConsultation.preferredDate)} at{" "}
                                  {selectedConsultation.preferredTime}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">Message</p>
                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                  {selectedConsultation.message}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-2">Update Status</p>
                                <Select
                                  value={selectedConsultation.status}
                                  onValueChange={(value) => updateConsultationStatus(selectedConsultation.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
