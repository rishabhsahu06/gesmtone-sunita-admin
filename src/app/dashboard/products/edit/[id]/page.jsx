"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Upload,
  X,
  ImageIcon,
  Edit2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { productAPI } from "@/lib/api"
import useAccessToken from "@/hooks/useSession"

// Custom Progress component
const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-[#BA8E49] h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
    />
  </div>
)

// Helper functions with improved error handling
const safeToString = (value) => {
  if (value === null || value === undefined) return ""
  return String(value)
}

const safeToNumber = (value) => {
  if (!value || value.trim() === "") return undefined
  const num = Number(value)
  return isNaN(num) ? undefined : num
}

const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`
  }
  return null
}

// Enhanced error boundary component
const ErrorFallback = ({ error, onRetry, onGoBack }) => (
  <div className="flex-1 space-y-6">
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-red-800">Something went wrong</CardTitle>
        </div>
        <CardDescription className="text-red-700">
          {error || "An unexpected error occurred while loading the product."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={onGoBack} variant="ghost" size="sm" className="text-red-700 hover:bg-red-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Enhanced loading skeleton
const LoadingSkeleton = () => (
  <div className="flex-1 space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-9 w-32 bg-gray-200 animate-pulse rounded-md" />
        <div className="h-8 w-48 bg-gray-300 animate-pulse rounded-md" />
      </div>
      <div className="flex space-x-2">
        <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md" />
        <div className="h-9 w-32 bg-gray-300 animate-pulse rounded-md" />
      </div>
    </div>

    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-300 rounded w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-5 bg-gray-300 rounded w-40 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  <div className="h-10 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                  <div className="h-10 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

// Image Upload Section Component
const ImageUploadSection = ({ images, onChange }) => {
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [altText, setAltText] = useState("")
  const [editingImageIndex, setEditingImageIndex] = useState(null)
  const [editingAltText, setEditingAltText] = useState("")
  const { toast } = useToast()
  const { accessToken } = useAccessToken()

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF).",
        variant: "destructive",
      })
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUpload = async () => {
    if (!selectedFile || !accessToken) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("media", selectedFile)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success && result.data?.url) {
        // Create image object with URL and alt text
        const imageObject = {
          url: result.data.url,
          alt: altText.trim() || `Product image ${images.length + 1}`,
        }

        // Add the new image object to the images array
        onChange([...images, imageObject])

        // Reset the file selection and alt text
        setSelectedFile(null)
        setPreviewUrl(null)
        setAltText("")

        // Reset the file input
        const fileInput = document.getElementById("image-upload")
        if (fileInput) {
          fileInput.value = ""
        }

        toast({
          title: "Image uploaded",
          description: "Image has been successfully uploaded.",
        })
      } else {
        throw new Error("Upload response was not successful")
      }
    } catch (error) {
      console.error("Image upload failed:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setAltText("")
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }

    // Reset the file input
    const fileInput = document.getElementById("image-upload")
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const startEditingAlt = (index) => {
    setEditingImageIndex(index)
    setEditingAltText(images[index].alt || "")
  }

  const saveAltText = (index) => {
    const updatedImages = [...images]
    updatedImages[index] = {
      ...updatedImages[index],
      alt: editingAltText.trim() || `Product image ${index + 1}`,
    }
    onChange(updatedImages)
    setEditingImageIndex(null)
    setEditingAltText("")
  }

  const cancelEditingAlt = () => {
    setEditingImageIndex(null)
    setEditingAltText("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#BA8E49]">Product Images</CardTitle>
        <CardDescription>Upload and manage high-quality images of your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Selection Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#BA8E49] transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploadingImage}
          />

          {!selectedFile ? (
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-[#BA8E49]">Click to select image</span>
              </div>
              <div className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</div>
            </label>
          ) : (
            <div className="space-y-4">
              {/* Preview of selected image */}
              {previewUrl && (
                <div className="relative inline-block">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Selected image preview"
                    className="max-w-full max-h-32 rounded-lg object-cover"
                  />
                  <button
                    onClick={clearSelection}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={uploadingImage}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>

              {/* Alt Text Input */}
              <div className="space-y-2 text-left">
                <Label htmlFor="alt-text" className="text-sm font-medium text-gray-700">
                  Image Description (Alt Text)
                </Label>
                <Input
                  id="alt-text"
                  type="text"
                  placeholder="e.g., Ruby front view, Sapphire side angle"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  disabled={uploadingImage}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">
                  Optional: Describe the image for better accessibility and organization
                </p>
              </div>

              {/* Upload Button */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleUpload}
                  disabled={uploadingImage || !accessToken}
                  className="bg-[#BA8E49] hover:bg-[#A67B3C] text-white"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={clearSelection} disabled={uploadingImage}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Uploaded Images Display */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Images ({images.length})</h4>
              <Badge variant="secondary" className="text-xs">
                {images.length} image{images.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((imageObj, index) => (
                <div key={index} className="relative group border rounded-lg overflow-hidden bg-gray-50">
                  <div className="aspect-square">
                    <img
                      src={imageObj.url || "/placeholder.svg"}
                      alt={imageObj.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                  </div>

                  {/* Image Controls */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditingAlt(index)}
                      className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
                      title="Edit alt text"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Alt Text Display/Edit */}
                  <div className="p-3 bg-white border-t">
                    {editingImageIndex === index ? (
                      <div className="space-y-2">
                        <Input
                          value={editingAltText}
                          onChange={(e) => setEditingAltText(e.target.value)}
                          placeholder="Enter image description"
                          className="text-xs"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => saveAltText(index)}
                            className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditingAlt} className="h-6 px-2 text-xs">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 truncate flex-1 mr-2">
                          {imageObj.alt || `Image ${index + 1}`}
                        </p>
                        <button
                          onClick={() => startEditingAlt(index)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit description"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Images State */}
        {images.length === 0 && !selectedFile && (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No images uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">Add images to showcase your product</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const { accessToken } = useAccessToken()
  const { toast } = useToast()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [saveProgress, setSaveProgress] = useState(0)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [editingProduct, setEditingProduct] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    primaryCategory: "",
    secondaryCategory: "",
    stock: "",
    weight: "",
    weightRatti: "",
    weightCarat: "",
    shape: "",
    origin: "",
    certification: "",
    poojaEnergization: "",
    colour: "",
    treatment: "",
    treatmentType: "",
    composition: "",
    returnPolicy: "",
    dimensionType: "",
    specificGravity: "",
    isAvailable: true,
    images: [], // Add images to the editing state
  })

  // Enhanced validation with real-time feedback
  const validateForm = useCallback(() => {
    const errors = {}

    // Required field validations
    const nameError = validateRequired(editingProduct.name, "Product name")
    if (nameError) errors.name = nameError

    const stockError = validateRequired(editingProduct.stock, "Stock")
    if (stockError) errors.stock = stockError
    else if (isNaN(Number(editingProduct.stock)) || Number(editingProduct.stock) < 0) {
      errors.stock = "Stock must be a valid non-negative number"
    }

    const originalPriceError = validateRequired(editingProduct.originalPrice, "Original price")
    if (originalPriceError) errors.originalPrice = originalPriceError
    else if (isNaN(Number(editingProduct.originalPrice)) || Number(editingProduct.originalPrice) <= 0) {
      errors.originalPrice = "Original price must be a valid positive number"
    }

    const primaryCategoryError = validateRequired(editingProduct.primaryCategory, "Primary category")
    if (primaryCategoryError) errors.primaryCategory = primaryCategoryError

    // Optional field validations with better error messages
    if (editingProduct.discountedPrice) {
      const discountedPrice = Number(editingProduct.discountedPrice)
      const originalPrice = Number(editingProduct.originalPrice)

      if (isNaN(discountedPrice) || discountedPrice < 0) {
        errors.discountedPrice = "Discounted price must be a valid non-negative number"
      } else if (originalPrice && discountedPrice >= originalPrice) {
        errors.discountedPrice = "Discounted price must be less than original price"
      }
    }

    // Weight validations
    const weightFields = ["weight", "weightRatti", "weightCarat", "specificGravity"]
    weightFields.forEach((field) => {
      if (editingProduct[field] && (isNaN(Number(editingProduct[field])) || Number(editingProduct[field]) < 0)) {
        const fieldName = field.replace(/([A-Z])/g, " $1").toLowerCase()
        errors[field] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be a valid non-negative number`
      }
    })

    if (editingProduct.specificGravity && Number(editingProduct.specificGravity) <= 0) {
      errors.specificGravity = "Specific gravity must be a positive number"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [editingProduct])

  // Real-time validation
  useEffect(() => {
    if (hasUnsavedChanges) {
      validateForm()
    }
  }, [editingProduct, hasUnsavedChanges, validateForm])

  // Enhanced fetch with retry mechanism
  const fetchProduct = useCallback(
    async (retryCount = 0) => {
      if (!productId) {
        setError("Product ID is missing from the URL")
        setLoading(false)
        return
      }

      if (!accessToken) {
        setError("Authentication required. Please log in again.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await productAPI.getById(productId, accessToken)

        if (!response?.data?.data) {
          throw new Error("Invalid response format from server")
        }

        const productData = response.data.data
        setProduct(productData)

        // Populate form with safe value conversion
        const formData = {
          name: safeToString(productData.name),
          description: safeToString(productData.description),
          originalPrice: safeToString(productData.originalPrice),
          discountedPrice: safeToString(productData.discountedPrice),
          primaryCategory: safeToString(productData.primaryCategory),
          secondaryCategory: safeToString(productData.secondaryCategory),
          stock: safeToString(productData.stock),
          weight: safeToString(productData.weight),
          weightRatti: safeToString(productData.weightRatti),
          weightCarat: safeToString(productData.weightCarat),
          shape: safeToString(productData.shape),
          origin: safeToString(productData.origin),
          certification: safeToString(productData.certification),
          poojaEnergization: safeToString(productData.poojaEnergization),
          colour: safeToString(productData.colour),
          treatment: safeToString(productData.treatment),
          treatmentType: safeToString(productData.treatmentType),
          composition: safeToString(productData.composition),
          returnPolicy: safeToString(productData.returnPolicy),
          dimensionType: safeToString(productData.dimensionType),
          specificGravity: safeToString(productData.specificGravity),
          isAvailable: productData.isAvailable ?? true,
          images: productData.images || [], // Handle images array
        }

        setEditingProduct(formData)
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error("Failed to fetch product", error)

        let errorMessage = "Failed to fetch product details"

        if (error?.response?.status === 404) {
          errorMessage = "Product not found. It may have been deleted."
        } else if (error?.response?.status === 403) {
          errorMessage = "You don't have permission to edit this product."
        } else if (error?.response?.status >= 500) {
          errorMessage = "Server error. Please try again later."
        } else if (error?.message) {
          errorMessage = error.message
        }

        setError(errorMessage)

        // Retry mechanism for network errors
        if (retryCount < 2 && (error?.code === "NETWORK_ERROR" || error?.response?.status >= 500)) {
          setTimeout(() => fetchProduct(retryCount + 1), 2000 * (retryCount + 1))
          return
        }

        toast({
          title: "Error Loading Product",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [productId, accessToken, toast],
  )

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  // Enhanced update with progress tracking
  const handleUpdateProduct = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!productId || !accessToken) {
      toast({
        title: "Error",
        description: "Missing required information. Please refresh and try again.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      setSaveProgress(0)
      setError(null)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setSaveProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      // Transform data with validation
      const productData = {
        name: editingProduct.name.trim(),
        description: editingProduct.description.trim() || undefined,
        originalPrice: safeToNumber(editingProduct.originalPrice),
        discountedPrice: safeToNumber(editingProduct.discountedPrice),
        primaryCategory: editingProduct.primaryCategory,
        secondaryCategory: editingProduct.secondaryCategory || undefined,
        stock: safeToNumber(editingProduct.stock),
        weight: safeToNumber(editingProduct.weight),
        weightRatti: safeToNumber(editingProduct.weightRatti),
        weightCarat: safeToNumber(editingProduct.weightCarat),
        shape: editingProduct.shape.trim() || undefined,
        origin: editingProduct.origin.trim() || undefined,
        certification: editingProduct.certification.trim() || undefined,
        poojaEnergization: editingProduct.poojaEnergization.trim() || undefined,
        colour: editingProduct.colour.trim() || undefined,
        treatment: editingProduct.treatment.trim() || undefined,
        treatmentType: editingProduct.treatmentType.trim() || undefined,
        composition: editingProduct.composition.trim() || undefined,
        returnPolicy: editingProduct.returnPolicy.trim() || undefined,
        dimensionType: editingProduct.dimensionType.trim() || undefined,
        specificGravity: safeToNumber(editingProduct.specificGravity),
        isAvailable: editingProduct.isAvailable,
        images: editingProduct.images, // Include images in the update
      }

      await productAPI.update(productId, productData, accessToken)

      clearInterval(progressInterval)
      setSaveProgress(100)

      toast({
        title: "Success",
        description: "Product has been successfully updated.",
        action: (
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
            <span>Saved</span>
          </div>
        ),
      })

      setHasUnsavedChanges(false)

      // Navigate after a brief delay to show success state
      setTimeout(() => {
        router.push("/dashboard/products")
      }, 1500)
    } catch (error) {
      console.error("Failed to update product", error)

      let errorMessage = "Failed to update product"

      if (error?.response?.status === 400) {
        errorMessage = "Invalid product data. Please check your inputs."
      } else if (error?.response?.status === 403) {
        errorMessage = "You don't have permission to update this product."
      } else if (error?.response?.status === 404) {
        errorMessage = "Product not found. It may have been deleted."
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      setError(errorMessage)

      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      setSaveProgress(0)
    }
  }

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/dashboard/products")
      }
    } else {
      router.push("/dashboard/products")
    }
  }

  const handleRetry = () => {
    setError(null)
    fetchProduct()
  }

  const handleInputChange = (field, value) => {
    setEditingProduct((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handleImagesChange = (newImages) => {
    setEditingProduct((prev) => ({ ...prev, images: newImages }))
    setHasUnsavedChanges(true)
  }

  // Error state with enhanced UI
  if (error && !loading) {
    return <ErrorFallback error={error} onRetry={handleRetry} onGoBack={handleGoBack} />
  }

  // Enhanced loading state
  if (loading) {
    return <LoadingSkeleton />
  }

  const isFormValid = Object.keys(validationErrors).length === 0 && editingProduct.name.trim()
  const hasDiscountedPrice = editingProduct.discountedPrice && Number(editingProduct.discountedPrice) > 0
  const discountPercentage = hasDiscountedPrice
    ? Math.round(
        ((Number(editingProduct.originalPrice) - Number(editingProduct.discountedPrice)) /
          Number(editingProduct.originalPrice)) *
          100,
      )
    : 0

  return (
    <div className="flex-1 space-y-6 max-w-6xl  py-6 ">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button onClick={handleGoBack} variant="outline" size="sm" className="flex items-center hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div >
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Product</h1>
            {product && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved changes
            </Badge>
          )}
          <Button onClick={handleGoBack} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProduct}
            disabled={saving || !isFormValid}
            className="bg-[#BA8E49] hover:bg-[#A67B3E] text-white min-w-[140px]"
          >
            {saving ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                <span>Save Changes</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Progress bar during save */}
      {saving && (
        <div className="space-y-2">
          <Progress value={saveProgress} className="h-2" />
          <p className="text-sm text-gray-600 text-center">Updating product...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Form */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl">Product Information</CardTitle>
              <CardDescription>
                Update the product details below. Fields marked with <span className="text-red-500">*</span> are
                required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <Badge variant="outline">Required</Badge>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={editingProduct.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter product name"
                      className={`${validationErrors.name ? "border-red-500 focus:border-red-500" : "border-gray-300"} transition-colors`}
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm font-medium">
                      Stock Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={editingProduct.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      placeholder="Enter stock quantity"
                      className={`${validationErrors.stock ? "border-red-500 focus:border-red-500" : "border-gray-300"} transition-colors`}
                    />
                    {validationErrors.stock && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.stock}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editingProduct.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter detailed product description"
                    rows={4}
                    className="border-gray-300 transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500">{editingProduct.description.length}/500 characters</p>
                </div>
              </div>

              {/* Pricing with enhanced UI */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                    <Badge variant="outline">Required</Badge>
                  </div>
                  {hasDiscountedPrice && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {discountPercentage}% discount
                    </Badge>
                  )}
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice" className="text-sm font-medium">
                      Original Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingProduct.originalPrice}
                        onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                        placeholder="0.00"
                        className={`pl-8 ${validationErrors.originalPrice ? "border-red-500 focus:border-red-500" : "border-gray-300"} transition-colors`}
                      />
                    </div>
                    {validationErrors.originalPrice && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.originalPrice}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice" className="text-sm font-medium">
                      Discounted Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        id="discountedPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingProduct.discountedPrice}
                        onChange={(e) => handleInputChange("discountedPrice", e.target.value)}
                        placeholder="0.00"
                        className={`pl-8 ${validationErrors.discountedPrice ? "border-red-500 focus:border-red-500" : "border-gray-300"} transition-colors`}
                      />
                    </div>
                    {validationErrors.discountedPrice && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.discountedPrice}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">Leave empty if no discount</p>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                  <Badge variant="outline">Required</Badge>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryCategory" className="text-sm font-medium">
                      Primary Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={editingProduct.primaryCategory}
                      onValueChange={(value) => handleInputChange("primaryCategory", value)}
                    >
                      <SelectTrigger
                        className={`${validationErrors.primaryCategory ? "border-red-500" : "border-gray-300"} transition-colors`}
                      >
                        <SelectValue placeholder="Select primary category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pink-sapphire">Pink Sapphire</SelectItem>
                        <SelectItem value="blue-sapphire">Blue Sapphire</SelectItem>
                        <SelectItem value="yellow-sapphire">Yellow Sapphire</SelectItem>
                        <SelectItem value="red-coral">Red Coral</SelectItem>
                        <SelectItem value="pearl">Pearl</SelectItem>
                        <SelectItem value="hessonite">Hessonite</SelectItem>
                        <SelectItem value="ruby">Ruby</SelectItem>
                        <SelectItem value="emerald">Emerald</SelectItem>
                        <SelectItem value="diamond">Diamond</SelectItem>
                        <SelectItem value="opal">Opal</SelectItem>
                        <SelectItem value="amethyst">Amethyst</SelectItem>
                        <SelectItem value="topaz">Topaz</SelectItem>
                        <SelectItem value="garnet">Garnet</SelectItem>
                        <SelectItem value="tanzanite">Tanzanite</SelectItem>
                        <SelectItem value="aquamarine">Aquamarine</SelectItem>
                        <SelectItem value="peridot">Peridot</SelectItem>
                        <SelectItem value="tourmaline">Tourmaline</SelectItem>
                        <SelectItem value="citrine">Citrine</SelectItem>
                        <SelectItem value="moonstone">Moonstone</SelectItem>
                        <SelectItem value="alexandrite">Alexandrite</SelectItem>
                        <SelectItem value="lapis-lazuli">Lapis Lazuli</SelectItem>
                        <SelectItem value="turquoise">Turquoise</SelectItem>
                        <SelectItem value="spinel">Spinel</SelectItem>
                        <SelectItem value="iolite">Iolite</SelectItem>
                        <SelectItem value="zircon">Zircon</SelectItem>
                        <SelectItem value="chrysoberyl">Chrysoberyl</SelectItem>
                        <SelectItem value="kyanite">Kyanite</SelectItem>
                        <SelectItem value="sodalite">Sodalite</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.primaryCategory && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.primaryCategory}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryCategory" className="text-sm font-medium">
                      Secondary Category
                    </Label>
                    <Select
                      value={editingProduct.secondaryCategory}
                      onValueChange={(value) => handleInputChange("secondaryCategory", value)}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select secondary category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemstone-rings">Gemstone Rings</SelectItem>
                        <SelectItem value="gemstone-pendants">Gemstone Pendants</SelectItem>
                        <SelectItem value="loose-gemstones">Loose Gemstones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Physical Properties */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Physical Properties</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm font-medium">
                      Weight (grams)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="0.00"
                      className={`${validationErrors.weight ? "border-red-500" : "border-gray-300"} transition-colors`}
                    />
                    {validationErrors.weight && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.weight}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightRatti" className="text-sm font-medium">
                      Weight (Ratti)
                    </Label>
                    <Input
                      id="weightRatti"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.weightRatti}
                      onChange={(e) => handleInputChange("weightRatti", e.target.value)}
                      placeholder="0.00"
                      className={`${validationErrors.weightRatti ? "border-red-500" : "border-gray-300"} transition-colors`}
                    />
                    {validationErrors.weightRatti && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.weightRatti}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightCarat" className="text-sm font-medium">
                      Weight (Carat)
                    </Label>
                    <Input
                      id="weightCarat"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.weightCarat}
                      onChange={(e) => handleInputChange("weightCarat", e.target.value)}
                      placeholder="0.00"
                      className={`${validationErrors.weightCarat ? "border-red-500" : "border-gray-300"} transition-colors`}
                    />
                    {validationErrors.weightCarat && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.weightCarat}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shape" className="text-sm font-medium">
                      Shape
                    </Label>
                    <Input
                      id="shape"
                      value={editingProduct.shape}
                      onChange={(e) => handleInputChange("shape", e.target.value)}
                      placeholder="e.g., Round, Oval, Square"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colour" className="text-sm font-medium">
                      Colour
                    </Label>
                    <Input
                      id="colour"
                      value={editingProduct.colour}
                      onChange={(e) => handleInputChange("colour", e.target.value)}
                      placeholder="e.g., Deep Blue, Pink"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specificGravity" className="text-sm font-medium">
                      Specific Gravity
                    </Label>
                    <Input
                      id="specificGravity"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.specificGravity}
                      onChange={(e) => handleInputChange("specificGravity", e.target.value)}
                      placeholder="0.00"
                      className={`${validationErrors.specificGravity ? "border-red-500" : "border-gray-300"} transition-colors`}
                    />
                    {validationErrors.specificGravity && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.specificGravity}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Origin & Certification */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Origin & Certification</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin" className="text-sm font-medium">
                      Origin
                    </Label>
                    <Input
                      id="origin"
                      value={editingProduct.origin}
                      onChange={(e) => handleInputChange("origin", e.target.value)}
                      placeholder="e.g., Sri Lanka, Myanmar"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certification" className="text-sm font-medium">
                      Certification
                    </Label>
                    <Input
                      id="certification"
                      value={editingProduct.certification}
                      onChange={(e) => handleInputChange("certification", e.target.value)}
                      placeholder="e.g., GIA, AIGS"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poojaEnergization" className="text-sm font-medium">
                    Pooja Energization
                  </Label>
                  <Input
                    id="poojaEnergization"
                    value={editingProduct.poojaEnergization}
                    onChange={(e) => handleInputChange("poojaEnergization", e.target.value)}
                    placeholder="Enter pooja energization details"
                    className="border-gray-300"
                  />
                </div>
              </div>

              {/* Treatment & Composition */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Treatment & Composition</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="treatment" className="text-sm font-medium">
                      Treatment
                    </Label>
                    <Input
                      id="treatment"
                      value={editingProduct.treatment}
                      onChange={(e) => handleInputChange("treatment", e.target.value)}
                      placeholder="e.g., Heat treated, Natural"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="treatmentType" className="text-sm font-medium">
                      Treatment Type
                    </Label>
                    <Input
                      id="treatmentType"
                      value={editingProduct.treatmentType}
                      onChange={(e) => handleInputChange("treatmentType", e.target.value)}
                      placeholder="Specific treatment details"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="composition" className="text-sm font-medium">
                    Composition
                  </Label>
                  <Input
                    id="composition"
                    value={editingProduct.composition}
                    onChange={(e) => handleInputChange("composition", e.target.value)}
                    placeholder="Chemical composition"
                    className="border-gray-300"
                  />
                </div>
              </div>

              {/* Other Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dimensionType" className="text-sm font-medium">
                      Dimension Type
                    </Label>
                    <Input
                      id="dimensionType"
                      value={editingProduct.dimensionType}
                      onChange={(e) => handleInputChange("dimensionType", e.target.value)}
                      placeholder="e.g., Length x Width x Height"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returnPolicy" className="text-sm font-medium">
                      Return Policy
                    </Label>
                    <Input
                      id="returnPolicy"
                      value={editingProduct.returnPolicy}
                      onChange={(e) => handleInputChange("returnPolicy", e.target.value)}
                      placeholder="e.g., 30 days return policy"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="isAvailable"
                    checked={editingProduct.isAvailable}
                    onCheckedChange={(checked) => handleInputChange("isAvailable", Boolean(checked))}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="isAvailable"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Product is available for purchase
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Uncheck this to temporarily hide the product from customers
                    </p>
                  </div>
                  <Badge variant={editingProduct.isAvailable ? "default" : "secondary"}>
                    {editingProduct.isAvailable ? "Available" : "Hidden"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Upload Section - Right Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ImageUploadSection images={editingProduct.images} onChange={handleImagesChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
