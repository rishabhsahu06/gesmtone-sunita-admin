"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productAPI } from "@/lib/api";
import useAccessToken from "@/hooks/useSession";
import BasicInformationForm from "@/components/add-products/basic-information-form";
import PricingForm from "@/components/add-products/pricing-form";
import ImageUploadSection from "@/components/add-products/image-upload-section";
import JewelleryDetailsForm from "@/components/add-jewellery/jewellery-details-form";

const emptyState = {
  name: "",
  description: "",
  originalPrice: "",
  discountedPrice: "",
  stock: "",
  jewelleryType: "",
  metal: "",
  jewelleryTag: "all",
  goldPurity: "",
  size: "",
  weight: "",
  isAvailable: true,
  images: [],
};

export default function EditJewelleryPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { accessToken } = useAccessToken();
  const { toast } = useToast();

  const [item, setItem] = useState(emptyState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItem = useCallback(async () => {
    if (!productId || !accessToken) return;

    try {
      setLoading(true);
      const response = await productAPI.getById(productId, accessToken);
      const data = response.data.data;

      setItem({
        name: data.name || "",
        description: data.description || "",
        originalPrice: data.originalPrice ?? "",
        discountedPrice: data.discountedPrice ?? "",
        stock: data.stock ?? "",
        jewelleryType: data.jewelleryType || "",
        metal: data.metal || "",
        jewelleryTag: data.jewelleryTag || "all",
        goldPurity: data.goldPurity || "",
        size: data.size || "",
        weight: data.weight ?? "",
        isAvailable: data.isAvailable ?? true,
        images: data.images || [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load jewellery.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [productId, accessToken, toast]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const canSave =
    !saving &&
    Boolean(item.name?.trim()) &&
    Boolean(item.description?.trim()) &&
    Boolean(item.originalPrice) &&
    Boolean(item.stock) &&
    Boolean(item.jewelleryType) &&
    Boolean(item.metal) &&
    item.images?.length > 0;

  const handleSave = async () => {
    if (!canSave) return;

    try {
      setSaving(true);
      const payload = {
        productType: "jewellery",
        primaryCategory: "jewellery",
        secondaryCategory: "none",
        name: item.name.trim(),
        description: item.description.trim(),
        originalPrice: Number.parseFloat(item.originalPrice),
        discountedPrice:
          item.discountedPrice !== ""
            ? Number.parseFloat(item.discountedPrice)
            : undefined,
        stock: Number.parseInt(item.stock, 10),
        jewelleryType: item.jewelleryType,
        metal: item.metal,
        jewelleryTag: item.jewelleryTag || "all",
        goldPurity: item.goldPurity?.trim() || "",
        size: item.size?.trim() || "",
        weight:
          item.weight !== "" && !Number.isNaN(Number(item.weight))
            ? Number.parseFloat(item.weight)
            : undefined,
        isAvailable: item.isAvailable,
        images: item.images,
      };

      await productAPI.update(productId, payload, accessToken);
      toast({
        title: "Jewellery updated",
        description: "Changes will show on the storefront.",
      });
      router.push("/dashboard/jewellery");
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Failed to update jewellery.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 py-6">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="h-96 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -mx-4 -mt-4">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/jewellery")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Jewellery</h1>
                <p className="text-sm text-gray-500">Update this piece and its storefront listing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/jewellery")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!canSave}
                className="bg-[#0C2D48] hover:bg-[#0c2d40] text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BasicInformationForm product={item} onChange={setItem} />
            <PricingForm product={item} onChange={setItem} />
            <JewelleryDetailsForm product={item} onChange={setItem} />
          </div>
          <div className="lg:col-span-1">
            <ImageUploadSection product={item} onChange={setItem} />
          </div>
        </div>
      </div>
    </div>
  );
}
