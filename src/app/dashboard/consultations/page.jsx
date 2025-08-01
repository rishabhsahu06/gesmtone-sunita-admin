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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, Phone, Calendar, Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { consultationAPI } from "@/lib/api"
import useAccessToken from "@/hooks/useSession"

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([])
  const [filteredConsultations, setFilteredConsultations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const { toast } = useToast()
  const { accessToken } = useAccessToken()

  // Fetch consultations from API with pagination
  const fetchConsultations = async (page = 1, limit = 10) => {
    try {
      setLoading(true)
      const response = await consultationAPI.getAll(accessToken, { page, limit })

      if (!response.data.success) {
        throw new Error("Failed to fetch consultations")
      }

      if (response.data.success) {
        // Transform API data to match component structure
        const transformedData = response.data.data.map((booking) => ({
          id: booking._id,
          name: booking.name,
          email: booking.email,
          phone: booking.phoneNumber,
          company: booking.birthPlace,
          service: booking.purpose,
          preferredDate: booking.dateOfBirth,
          preferredTime: booking.timeOfBirth,
          message: booking.message,
          status: booking.status.toLowerCase(),
          submittedAt: booking.createdAt,
          gender: booking.gender,
          birthPlace: booking.birthPlace,
          dateOfBirth: booking.dateOfBirth,
          timeOfBirth: booking.timeOfBirth,
          updatedAt: booking.updatedAt,
        }))

        setConsultations(transformedData)
        setFilteredConsultations(transformedData)

        // Update pagination state
        setPagination({
          currentPage: response.data.pagination?.currentPage || page,
          totalPages: response.data.pagination?.totalPages || 1,
          totalBookings: response.data.pagination?.totalBookings || transformedData.length,
          limit: response.data.pagination?.limit || limit,
          hasNext: response.data.pagination?.hasNext || false,
          hasPrev: response.data.pagination?.hasPrev || false,
        })
      } else {
        throw new Error(response.message || "Failed to fetch consultations")
      }
    } catch (error) {
      console.error("Error fetching consultations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch consultation data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchConsultations(currentPage, itemsPerPage)
    }
  }, [accessToken, currentPage, itemsPerPage])

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page)
    }
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const updateConsultationStatus = async (consultationId, newStatus) => {
    const FixCharAt = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)

    try {
      const response = await consultationAPI.updateStatus(consultationId, FixCharAt, accessToken)
      if (!response.data.success) {
        throw new Error("Failed to update consultation status")
      }

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
      console.error("Error updating consultation:", error)
      toast({
        title: "Error",
        description: "Failed to update consultation status.",
        variant: "destructive",
      })
    }
  }

  const deleteConsultation = async (consultationId) => {
    try {
      setDeletingId(consultationId)
      
      // Call the API to delete the consultation
      const response = await consultationAPI.delete(consultationId, accessToken)
      
      if (!response.data.success) {
        throw new Error("Failed to delete consultation")
      }

      // Remove the consultation from the local state
      setConsultations(consultations.filter((consultation) => consultation.id !== consultationId))
      setFilteredConsultations(filteredConsultations.filter((consultation) => consultation.id !== consultationId))

      // Update pagination count
      setPagination(prev => ({
        ...prev,
        totalBookings: prev.totalBookings - 1
      }))

      toast({
        title: "Consultation deleted",
        description: "The consultation has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting consultation:", error)
      toast({
        title: "Error",
        description: "Failed to delete consultation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Birth Place",
      "Purpose",
      "Gender",
      "Date of Birth",
      "Time of Birth",
      "Status",
      "Submitted At",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredConsultations.map((consultation) =>
        [
          consultation.id,
          `"${consultation.name}"`,
          consultation.email,
          consultation.phone,
          `"${consultation.birthPlace}"`,
          `"${consultation.service}"`,
          consultation.gender,
          consultation.dateOfBirth,
          consultation.timeOfBirth,
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

  const formatTime = (timeString) => {
    if (!timeString) return ""
    return timeString.substring(0, 5)
  }

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading consultations...</span>
        </div>
      </div>
    )
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
            <div className="text-2xl font-bold">{pagination.totalBookings}</div>
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
          <CardDescription>
            View and manage consultation call requests
            <span className="ml-2">
              (Page {pagination.currentPage} of {pagination.totalPages}, Total: {pagination.totalBookings})
            </span>
          </CardDescription>
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
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Birth Place</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Birth Details</TableHead>
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
                    <TableCell>{consultation.birthPlace}</TableCell>
                    <TableCell>{consultation.service}</TableCell>
                    <TableCell>
                      <div>
                        <div>{formatDate(consultation.dateOfBirth)}</div>
                        <div className="text-sm text-muted-foreground">{formatTime(consultation.timeOfBirth)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(consultation.status)}>
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedConsultation(consultation)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Consultation Details</DialogTitle>
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
                                    <p className="text-sm font-medium">Gender</p>
                                    <p className="text-sm text-muted-foreground">{selectedConsultation.gender}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Birth Place</p>
                                    <p className="text-sm text-muted-foreground">{selectedConsultation.birthPlace}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Purpose</p>
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
                                  <p className="text-sm font-medium">Birth Date & Time</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(selectedConsultation.dateOfBirth)} at{" "}
                                    {formatTime(selectedConsultation.timeOfBirth)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-2">Message</p>
                                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                    {selectedConsultation.message}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-4">
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
                                      <SelectItem value="bad">Bad Lead</SelectItem>
                                      <SelectItem value="good">Good Lead</SelectItem>
                                      <SelectItem value="future">Keeping this for future</SelectItem>
                                    </SelectContent>
                                  </Select>
                               </div>
                              
                                </div>
                              </div>
                              
                            )}
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled={deletingId === consultation.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {deletingId === consultation.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Consultation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this consultation call from <strong>{consultation.name}</strong>? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteConsultation(consultation.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, pagination.totalBookings)} of {pagination.totalBookings} results
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev || currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {generatePageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext || currentPage === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}