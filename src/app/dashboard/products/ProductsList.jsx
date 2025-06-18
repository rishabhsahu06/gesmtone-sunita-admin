"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2, AlertTriangle } from "lucide-react"

// Sample data for testing
const sampleProducts = [
  {
    id: 1,
    name: "Product 1",
    category: "Category A",
    originalPrice: 100,
    discountedPrice: 80,
    stock: 50,
    status: "active",
    origin: "India",
    weight: 500,
    shape: "Round",
  },
  {
    id: 2,
    name: "Product 2",
    category: "Category B",
    originalPrice: 200,
    discountedPrice: null,
    stock: 30,
    status: "inactive",
    origin: "China",
    weight: 300,
    shape: "Square",
  },
  {
    id: 3,
    name: "Product 3",
    category: "Category A",
    originalPrice: 150,
    discountedPrice: 120,
    stock: 25,
    status: "active",
    origin: "USA",
    weight: 400,
    shape: "Round",
  },
  {
    id: 4,
    name: "Product 4",
    category: "Category C",
    originalPrice: 300,
    discountedPrice: 250,
    stock: 15,
    status: "active",
    origin: "Germany",
    weight: 600,
    shape: "Oval",
  },
  {
    id: 5,
    name: "Product 5",
    category: "Category B",
    originalPrice: 120,
    discountedPrice: null,
    stock: 40,
    status: "inactive",
    origin: "Japan",
    weight: 350,
    shape: "Square",
  },
  {
    id: 6,
    name: "Product 6",
    category: "Category A",
    originalPrice: 180,
    discountedPrice: 150,
    stock: 60,
    status: "active",
    origin: "India",
    weight: 450,
    shape: "Round",
  },
  {
    id: 7,
    name: "Product 7",
    category: "Category C",
    originalPrice: 250,
    discountedPrice: 200,
    stock: 20,
    status: "active",
    origin: "France",
    weight: 500,
    shape: "Oval",
  },
  {
    id: 8,
    name: "Product 8",
    category: "Category B",
    originalPrice: 90,
    discountedPrice: null,
    stock: 35,
    status: "inactive",
    origin: "Italy",
    weight: 280,
    shape: "Square",
  },
  {
    id: 9,
    name: "Product 9",
    category: "Category A",
    originalPrice: 220,
    discountedPrice: 180,
    stock: 45,
    status: "active",
    origin: "Spain",
    weight: 520,
    shape: "Round",
  },
  {
    id: 10,
    name: "Product 10",
    category: "Category C",
    originalPrice: 160,
    discountedPrice: 140,
    stock: 55,
    status: "active",
    origin: "Canada",
    weight: 380,
    shape: "Oval",
  },
  {
    id: 11,
    name: "Product 11",
    category: "Category B",
    originalPrice: 280,
    discountedPrice: null,
    stock: 25,
    status: "inactive",
    origin: "Australia",
    weight: 420,
    shape: "Square",
  },
  {
    id: 12,
    name: "Product 12",
    category: "Category A",
    originalPrice: 190,
    discountedPrice: 160,
    stock: 30,
    status: "active",
    origin: "Brazil",
    weight: 480,
    shape: "Round",
  },
  {
    id: 13,
    name: "Product 13",
    category: "Category C",
    originalPrice: 320,
    discountedPrice: 280,
    stock: 18,
    status: "active",
    origin: "Mexico",
    weight: 550,
    shape: "Oval",
  },
  {
    id: 14,
    name: "Product 14",
    category: "Category B",
    originalPrice: 110,
    discountedPrice: null,
    stock: 42,
    status: "inactive",
    origin: "Russia",
    weight: 320,
    shape: "Square",
  },
  {
    id: 15,
    name: "Product 15",
    category: "Category A",
    originalPrice: 240,
    discountedPrice: 200,
    stock: 38,
    status: "active",
    origin: "South Korea",
    weight: 460,
    shape: "Round",
  },
]

export default function ProductsList({
  products = sampleProducts,
  onEdit = () => {},
  onDelete = () => {},
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const itemsPerPage = 10 // Reduced for better testing

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  // Handle page changes
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePrevious = (e) => {
    e.preventDefault()
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Handle delete confirmation
  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete.id)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Original Price</TableHead>
              <TableHead>Discounted Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Shape</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.originalPrice}</TableCell>
                  <TableCell>{product.discountedPrice ? `₹${product.discountedPrice}` : "-"}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>{product.origin || "-"}</TableCell>
                  <TableCell>{product.weight ? `${product.weight}g` : "-"}</TableCell>
                  <TableCell>{product.shape || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(product)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls - Always show if there are products */}
      {products.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} products
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
                          e.preventDefault()
                          handlePageChange(page)
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Product Deletion
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this product? This action cannot be undone and all related data will be permanently removed.
                </p>
                
                {productToDelete && (
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-foreground">Product Details:</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Name:</span>
                        <span className="ml-2 text-foreground">{productToDelete.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Category:</span>
                        <span className="ml-2 text-foreground">{productToDelete.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Original Price:</span>
                        <span className="ml-2 text-foreground">₹{productToDelete.originalPrice}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Discounted Price:</span>
                        <span className="ml-2 text-foreground">
                          {productToDelete.discountedPrice ? `₹${productToDelete.discountedPrice}` : "No discount"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Stock:</span>
                        <span className="ml-2 text-foreground">{productToDelete.stock} units</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Status:</span>
                        <span className="ml-2">
                          <Badge variant={productToDelete.status === "active" ? "default" : "secondary"}>
                            {productToDelete.status}
                          </Badge>
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Origin:</span>
                        <span className="ml-2 text-foreground">{productToDelete.origin || "Not specified"}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Weight:</span>
                        <span className="ml-2 text-foreground">
                          {productToDelete.weight ? `${productToDelete.weight}g` : "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Shape:</span>
                        <span className="ml-2 text-foreground">{productToDelete.shape || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-red-800 text-sm font-medium">
                    ⚠️ Warning: The following data will be permanently deleted:
                  </p>
                  <ul className="text-red-700 text-sm mt-2 list-disc list-inside space-y-1">
                    <li>Product information and specifications</li>
                    <li>Pricing and discount data</li>
                    <li>Stock and inventory records</li>
                    <li>All associated product history</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Debug info - remove this in production */}
      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
        Debug: Total products: {products.length}, Total pages: {totalPages}, Current page: {currentPage}, Items per
        page: {itemsPerPage}
      </div>
    </div>
  )
}