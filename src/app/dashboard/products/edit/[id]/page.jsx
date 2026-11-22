"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productAPI } from "@/lib/api";
import {
  buildStonePayload,
  INITIAL_STONE_FORM,
  mapProductToForm,
} from "@/lib/product-form";
import useAccessToken from "@/hooks/useSession";
import { useToast } from "@/hooks/use-toast";
import ProductHeader from "@/components/add-products/product-header";
import BasicInformationForm from "@/components/add-products/basic-information-form";
import PricingForm from "@/components/add-products/pricing-form";
import CategoriesForm from "@/components/add-products/categories-form";
import PhysicalPropertiesForm from "@/components/add-products/physical-properties-form";
import OriginCertificationForm from "@/components/add-products/origion-certification-form";
import TreatmentCompositionForm from "@/components/add-products/treatment-composition-form";
import AdditionalDetailsForm from "@/components/add-products/additional-details-form";
import ImageUploadSection from "@/components/add-products/image-upload-section";
import FormPageSkeleton from "@/components/skeleton/formPageSkeleton";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { accessToken, status: sessionStatus } = useAccessToken();
  const { toast } = useToast();

  const [formData, setFormData] = useState(INITIAL_STONE_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!productId || !accessToken) return;

    try {
      setLoading(true);
      const response = await productAPI.getById(productId, accessToken);
      const productData = response?.data?.data;
      if (!productData) throw new Error("Invalid response from server");
      setFormData(mapProductToForm(productData));
    } catch (err) {
      toast({
        title: "Error Loading Product",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [productId, accessToken, toast]);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (accessToken) fetchProduct();
    else setLoading(false);
  }, [fetchProduct, accessToken, sessionStatus]);

  const canSave =
    !saving &&
    Boolean(formData.name?.trim()) &&
    Boolean(accessToken) &&
    Boolean(productId);

  const handleUpdate = async () => {
    if (!canSave) return;

    try {
      setSaving(true);
      const payload = buildStonePayload(formData);
      await productAPI.update(productId, payload, accessToken);
      toast({
        title: "Stone updated",
        description: "Changes will show on the storefront.",
      });
      router.push("/dashboard/products");
    } catch (err) {
      toast({
        title: "Update Failed",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || sessionStatus === "loading") {
    return <FormPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 -mx-4 -mt-4">
      <ProductHeader
        loading={saving}
        onBack={() => router.push("/dashboard/products")}
        onCancel={() => router.push("/dashboard/products")}
        onSave={handleUpdate}
        canSave={canSave}
        title="Edit Stone"
        subtitle={formData.name || "Update stone details"}
        saveLabel="Save Changes"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BasicInformationForm
              product={formData}
              onChange={setFormData}
              nameLabel="Stone name"
              namePlaceholder="Enter stone name"
            />
            <PricingForm product={formData} onChange={setFormData} />
            <CategoriesForm product={formData} onChange={setFormData} />
            <PhysicalPropertiesForm product={formData} onChange={setFormData} />
            <OriginCertificationForm product={formData} onChange={setFormData} />
            <TreatmentCompositionForm product={formData} onChange={setFormData} />
            <AdditionalDetailsForm product={formData} onChange={setFormData} />
          </div>
          <div className="lg:col-span-1">
            <ImageUploadSection
              product={formData}
              onChange={setFormData}
              title="Stone photos"
              maxImages={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
