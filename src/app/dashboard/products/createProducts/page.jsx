"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { productAPI } from "@/lib/api";
import { buildStonePayload, INITIAL_STONE_FORM } from "@/lib/product-form";
import ProductHeader from "@/components/add-products/product-header";
import BasicInformationForm from "@/components/add-products/basic-information-form";
import PricingForm from "@/components/add-products/pricing-form";
import CategoriesForm from "@/components/add-products/categories-form";
import PhysicalPropertiesForm from "@/components/add-products/physical-properties-form";
import OriginCertificationForm from "@/components/add-products/origion-certification-form";
import TreatmentCompositionForm from "@/components/add-products/treatment-composition-form";
import AdditionalDetailsForm from "@/components/add-products/additional-details-form";
import ImageUploadSection from "@/components/add-products/image-upload-section";
import useAccessToken from "@/hooks/useSession";

export default function CreateProductPage() {
  const { accessToken } = useAccessToken();
  const [newProduct, setNewProduct] = useState(INITIAL_STONE_FORM);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const canSave =
    !loading &&
    Boolean(newProduct.name?.trim()) &&
    Boolean(newProduct.images?.length) &&
    Boolean(accessToken);

  const handleAddProduct = async () => {
    if (!canSave) return;

    try {
      setLoading(true);
      const payload = buildStonePayload(
        {
          ...newProduct,
          description:
            newProduct.description?.trim() ||
            newProduct.name?.trim() ||
            "Gemstone product details",
          primaryCategory:
            newProduct.primaryCategory?.trim() || "pink-sapphire",
          originalPrice: newProduct.originalPrice || 0,
          stock: newProduct.stock || 1,
        },
        { requireImages: true }
      );

      await productAPI.create(payload, accessToken);

      toast({
        title: "Stone added",
        description: "This stone will show on the storefront.",
      });

      setNewProduct(INITIAL_STONE_FORM);
      router.push("/dashboard/products");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to create product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader
        loading={loading}
        onBack={() => router.back()}
        onCancel={() => router.back()}
        onSave={handleAddProduct}
        canSave={canSave}
        title="Add Stone"
        subtitle="This stone appears in Find Your Perfect Stone"
        saveLabel="Save Stone"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BasicInformationForm
              product={newProduct}
              onChange={setNewProduct}
              nameLabel="Stone name"
              namePlaceholder="Enter stone name"
            />
            <PricingForm product={newProduct} onChange={setNewProduct} />
            <CategoriesForm product={newProduct} onChange={setNewProduct} />
            <PhysicalPropertiesForm
              product={newProduct}
              onChange={setNewProduct}
            />
            <OriginCertificationForm
              product={newProduct}
              onChange={setNewProduct}
            />
            <TreatmentCompositionForm
              product={newProduct}
              onChange={setNewProduct}
            />
            <AdditionalDetailsForm
              product={newProduct}
              onChange={setNewProduct}
            />
          </div>

          <div className="lg:col-span-1">
            <ImageUploadSection
              product={newProduct}
              onChange={setNewProduct}
              title="Stone photos"
              maxImages={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
