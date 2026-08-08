"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { productAPI } from "@/lib/api"
import ProductHeader from "@/components/add-products/product-header"
import BasicInformationForm from "@/components/add-products/basic-information-form"
import PricingForm from "@/components/add-products/pricing-form"
import CategoriesForm from "@/components/add-products/categories-form"
import PhysicalPropertiesForm from "@/components/add-products/physical-properties-form"
import OriginCertificationForm from "@/components/add-products/origion-certification-form"
import TreatmentCompositionForm from "@/components/add-products/treatment-composition-form"
import AdditionalDetailsForm from "@/components/add-products/additional-details-form"
import ImageUploadSection from "@/components/add-products/image-upload-section"
import useAccessToken from "@/hooks/useSession"


export default function CreateProductPage() {
  const { accessToken } = useAccessToken()

  // Define initial state as a constant to reuse for resetting
  const initialProductState = {
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    primaryCategory: "",
    primaryCategoryImage: "",
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
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    specificGravity: "",
    isAvailable: true,
    productBenefits: [],
    images: [],
  }

  const [newProduct, setNewProduct] = useState(initialProductState)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleAddProduct = async () => {
    try {
      setLoading(true)

      // Prepare dimensions object - only include if at least one dimension is provided
      const prepareDimensions = () => {
        const { length, width, height } = newProduct.dimensions

        // Check if any dimension has a value
        if (length || width || height) {
          return {
            length: length ? Number.parseFloat(length) : 0,
            width: width ? Number.parseFloat(width) : 0,
            height: height ? Number.parseFloat(height) : 0,
          }
        }

        return undefined // Don't include dimensions if none are provided
      }

      const productData = {
        name: newProduct.name?.trim() || "New Gemstone",
        description: newProduct.description?.trim() || newProduct.name?.trim() || "Gemstone product details",
        originalPrice: newProduct.originalPrice !== "" && newProduct.originalPrice !== undefined && !isNaN(Number(newProduct.originalPrice)) ? Number.parseFloat(newProduct.originalPrice) : 0,
        discountedPrice: newProduct.discountedPrice !== "" && newProduct.discountedPrice !== undefined && !isNaN(Number(newProduct.discountedPrice)) ? Number.parseFloat(newProduct.discountedPrice) : undefined,
        primaryCategory: newProduct.primaryCategory?.trim() || "pink-sapphire",
        primaryCategoryImage: newProduct.primaryCategoryImage?.trim() || undefined,
        secondaryCategory: newProduct.secondaryCategory?.trim() || undefined,
        stock: newProduct.stock !== "" && newProduct.stock !== undefined && !isNaN(Number(newProduct.stock)) ? Number.parseInt(newProduct.stock) : 1,
        weight: newProduct.weight !== "" && newProduct.weight !== undefined && !isNaN(Number(newProduct.weight)) ? Number.parseFloat(newProduct.weight) : undefined,
        weightRatti: newProduct.weightRatti !== "" && newProduct.weightRatti !== undefined && !isNaN(Number(newProduct.weightRatti)) ? Number.parseFloat(newProduct.weightRatti) : undefined,
        weightCarat: newProduct.weightCarat !== "" && newProduct.weightCarat !== undefined && !isNaN(Number(newProduct.weightCarat)) ? Number.parseFloat(newProduct.weightCarat) : undefined,
        shape: newProduct.shape?.trim() || undefined,
        origin: newProduct.origin?.trim() || undefined,
        certification: newProduct.certification?.trim() || undefined,
        poojaEnergization: newProduct.poojaEnergization?.trim() || undefined,
        colour: newProduct.colour?.trim() || undefined,
        treatment: newProduct.treatment?.trim() || undefined,
        treatmentType: newProduct.treatmentType?.trim() || undefined,
        composition: newProduct.composition?.trim() || undefined,
        returnPolicy: newProduct.returnPolicy?.trim() || undefined,
        dimensionType: newProduct.dimensionType?.trim() || undefined,
        dimensions: prepareDimensions(),
        specificGravity: newProduct.specificGravity !== "" && newProduct.specificGravity !== undefined && !isNaN(Number(newProduct.specificGravity)) ? Number.parseFloat(newProduct.specificGravity) : undefined,
        isAvailable: newProduct.isAvailable,
        images: newProduct.images?.length > 0 ? newProduct.images : [
          {
            url: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
            alt: newProduct.name?.trim() || "Gemstone Image"
          }
        ],
        productBenefits: newProduct.productBenefits?.length > 0 ? newProduct.productBenefits : undefined,
      }

      // Remove undefined values to clean up the payload
      const cleanProductData = Object.fromEntries(
        Object.entries(productData).filter(([_, value]) => value !== undefined),
      )

   

      await productAPI.create(cleanProductData, accessToken)

      toast({
        title: "Product created",
        description: "Product has been successfully created.",
        variant: "success",
      })

      // Reset the form to initial state after successful creation
      setNewProduct(initialProductState)

      // router.push("/admin/products")
    } catch (error) {
      console.error("Failed to create product", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create product.",
        variant: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader
        loading={loading}
        onBack={() => router.back()}
        onCancel={() => router.back()}
        onSave={handleAddProduct}
        canSave={!loading && Boolean(newProduct.name?.trim())}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BasicInformationForm product={newProduct} onChange={setNewProduct} />

            <PricingForm product={newProduct} onChange={setNewProduct} />

            <CategoriesForm product={newProduct} onChange={setNewProduct} />

            <PhysicalPropertiesForm product={newProduct} onChange={setNewProduct} />

            <OriginCertificationForm product={newProduct} onChange={setNewProduct} />

            <TreatmentCompositionForm product={newProduct} onChange={setNewProduct} />

            <AdditionalDetailsForm product={newProduct} onChange={setNewProduct} />
          </div>

          <div className="lg:col-span-1">
            <ImageUploadSection product={newProduct} onChange={setNewProduct} />
          </div>
        </div>

       
      </div>
    </div>
  )
}
