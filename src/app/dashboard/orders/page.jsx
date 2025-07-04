"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Eye, Download, Filter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAccessToken from "@/hooks/useSession";
import { orderAPI } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { toast } = useToast();
  const { accessToken } = useAccessToken();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll(accessToken);
      //hello check

      if (response.data.success) {
        const ordersData = response.data.data;
        const summaryData = response.data.summary;

        setOrders(ordersData);
        setFilteredOrders(ordersData);
        setSummary(summaryData);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  useEffect(() => {
    let filtered = orders.filter((order) => {
      const customerName = order.user?.name || "";
      const customerEmail = order.user?.email || "";
      const orderId = order._id || "";

      return (
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, orders]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Find the current order to get all its data
      const currentOrder = orders.find((order) => order._id === orderId);
      if (!currentOrder) {
        throw new Error("Order not found");
      }

      // Prepare the complete order data with updated status

      // Send complete order data to API
      const response = await orderAPI.updateStatus(
        orderId,
        newStatus,
        accessToken
      );

      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : order
          )
        );

        // Also update selectedOrder if it's the same order being updated
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          });
        }

        toast({
          title: "Order updated",
          description: `Order status changed to ${newStatus}.`,
        });
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description:
          error.response.data.message ||
          error.message ||
          "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Date",
      "Total",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map((order) => {
        const customerName = order.user?.name || "N/A";
        const customerEmail = order.user?.email || "N/A";
        const orderDate = new Date(order.createdAt).toLocaleDateString();

        return [
          order._id,
          `"${customerName}"`,
          customerEmail,
          orderDate,
          `${order.totalAmount}`,
          order.status,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "outline";
      case "pending":
        return "destructive";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchOrders} variant="outline">
            Refresh
          </Button>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards for Admin */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.todayOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.monthlyOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.pendingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.todayRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage customer orders ({orders.length} total orders)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number.parseInt(value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="w-[140px]">
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order._id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.user?.email || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 ">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4 " />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
                              <DialogHeader className="pb-4 border-b">
                                <DialogTitle className="text-xl font-semibold">
                                  Order #
                                  {selectedOrder?._id.slice(-8).toUpperCase()}
                                </DialogTitle>
                                <DialogDescription className="text-base">
                                  Placed on{" "}
                                  {selectedOrder &&
                                    formatDate(selectedOrder.createdAt)}
                                </DialogDescription>
                              </DialogHeader>

                              {selectedOrder && (
                                <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                                  {/* Order Status and Timeline */}
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-3">
                                      <h3 className="font-semibold text-lg">
                                        Order Status
                                      </h3>
                                      <Badge
                                        variant={getStatusColor(
                                          selectedOrder.status
                                        )}
                                        className="text-sm px-3 py-1"
                                      >
                                        {selectedOrder.status}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <p className="font-medium text-gray-600">
                                          Order Date
                                        </p>
                                        <p className="font-semibold">
                                          {formatDate(selectedOrder.createdAt)}
                                        </p>
                                      </div>
                                      {selectedOrder.deliveredAt && (
                                        <div>
                                          <p className="font-medium text-gray-600">
                                            Delivered Date
                                          </p>
                                          <p className="font-semibold text-green-600">
                                            {formatDate(
                                              selectedOrder.deliveredAt
                                            )}
                                          </p>
                                        </div>
                                      )}
                                      <div>
                                        <p className="font-medium text-gray-600">
                                          WhatsApp Notification
                                        </p>
                                        <p
                                          className={`font-semibold ${
                                            selectedOrder.whatsappNotificationSent
                                              ? "text-green-600"
                                              : "text-orange-600"
                                          }`}
                                        >
                                          {selectedOrder.whatsappNotificationSent
                                            ? "Sent"
                                            : "Pending"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Customer Information */}
                                  <div className="bg-gray-50 p-4 rounded-lg border">
                                    <h3 className="font-semibold text-lg mb-3">
                                      Customer Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-gray-600">
                                          Full Name
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                          {selectedOrder.user?.name || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-600">
                                          Email Address
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                          {selectedOrder.user?.email || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-600">
                                          Phone Number
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                          {selectedOrder.user?.phone || "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-600">
                                          Customer ID
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                          {selectedOrder.user?._id
                                            ?.slice(-8)
                                            .toUpperCase() || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Payment Information */}
                                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-lg mb-3 text-green-800">
                                      Payment Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-green-700">
                                          Payment Method
                                        </p>
                                        <p className="font-semibold text-green-900">
                                          {selectedOrder.paymentInfo?.method ||
                                            "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-green-700">
                                          Payment Status
                                        </p>
                                        <div className="flex items-center space-x-2">
                                          <Badge
                                            variant={
                                              selectedOrder.paymentInfo
                                                ?.status === "captured"
                                                ? "default"
                                                : "secondary"
                                            }
                                            className="text-xs"
                                          >
                                            {selectedOrder.paymentInfo
                                              ?.status || "N/A"}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-green-700">
                                          Transaction ID
                                        </p>
                                        <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                                          {selectedOrder.paymentInfo?.id ||
                                            "N/A"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-green-700">
                                          Total Amount
                                        </p>
                                        <p className="font-bold text-xl text-green-900">
                                          {formatCurrency(
                                            selectedOrder.totalAmount
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shipping Address */}
                                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-lg mb-3 text-blue-800">
                                      Shipping Address
                                    </h3>
                                    <div className="bg-white p-3 rounded border text-gray-900">
                                      <div className="space-y-1">
                                        <p className="font-semibold">
                                          {
                                            selectedOrder.shippingAddress
                                              ?.street
                                          }
                                        </p>
                                        <p>
                                          {selectedOrder.shippingAddress?.city},{" "}
                                          {selectedOrder.shippingAddress?.state}
                                        </p>
                                        <p>
                                          {
                                            selectedOrder.shippingAddress
                                              ?.postalCode
                                          }
                                        </p>
                                        <p className="font-medium">
                                          {
                                            selectedOrder.shippingAddress
                                              ?.country
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Order Items */}
                                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                    <h3 className="font-semibold text-lg mb-3 text-orange-800">
                                      Order Items (
                                      {selectedOrder.items?.length || 0})
                                    </h3>
                                    <div className="space-y-3">
                                      {selectedOrder.items?.map(
                                        (item, index) => (
                                          <div
                                            key={index}
                                            className="bg-white p-4 rounded-lg border flex items-center space-x-4"
                                          >
                                            <div className="flex-shrink-0">
                                              {item.image ? (
                                                <img
                                                  src={
                                                    item.image ||
                                                    "/placeholder.svg"
                                                  }
                                                  alt={item.name}
                                                  className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                                                />
                                              ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                  <span className="text-gray-400 text-xs">
                                                    No Image
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex-grow">
                                              <h4 className="font-semibold text-gray-900">
                                                {item.name}
                                              </h4>
                                              <p className="text-sm text-gray-600">
                                                Product ID:{" "}
                                                {item.product?._id
                                                  ?.slice(-8)
                                                  .toUpperCase() || "N/A"}
                                              </p>
                                              <div className="flex items-center space-x-4 mt-2">
                                                <span className="text-sm font-medium">
                                                  Qty: {item.quantity}
                                                </span>
                                                <span className="text-sm font-medium">
                                                  Price:{" "}
                                                  {formatCurrency(item.price)}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-bold text-lg">
                                                {formatCurrency(
                                                  item.price * item.quantity
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      ) || (
                                        <div className="bg-white p-4 rounded-lg border text-center text-gray-500">
                                          No items found
                                        </div>
                                      )}
                                    </div>

                                    {/* Order Total */}
                                    <div className="mt-4 pt-4 border-t border-orange-200">
                                      <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-orange-800">
                                          Order Total:
                                        </span>
                                        <span className="text-2xl font-bold text-orange-900">
                                          {formatCurrency(
                                            selectedOrder.totalAmount
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Update Status Section */}
                                  <div className="bg-gray-100 p-4 rounded-lg border">
                                    <h3 className="font-semibold text-lg mb-3">
                                      Update Order Status
                                    </h3>
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value) =>
                                        updateOrderStatus(
                                          selectedOrder._id,
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Processing">
                                          Processing
                                        </SelectItem>
                                        <SelectItem value="Shipped">
                                          Shipped
                                        </SelectItem>
                                        <SelectItem value="Delivered">
                                          Delivered
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={handlePrevious}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={handleNext}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
