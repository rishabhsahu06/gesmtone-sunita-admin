"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { productAPI } from "@/lib/api";
import ProductHeader from "@/components/add-products/product-header";
import BasicInformationForm from "@/components/add-products/basic-information-form";
import PricingForm from "@/components/add-products/pricing-form";
import ImageUploadSection from "@/components/add-products/image-upload-section";
import JewelleryDetailsForm from "@/components/add-jewellery/jewellery-details-form";
import useAccessToken from "@/hooks/useSession";

const initialJewelleryState = {
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

export default function CreateJewelleryPage() {
  const { accessToken } = useAccessToken();
  const [item, setItem] = useState(initialJewelleryState);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const canSave =
    !loading &&
    Boolean(item.name?.trim()) &&
    Boolean(item.description?.trim()) &&
    Boolean(item.originalPrice) &&
    Boolean(item.stock) &&
    Boolean(item.jewelleryType) &&
    item.images?.length > 0;

  const handleSave = async () => {
    if (!canSave) {
      toast({
        title: "Missing details",
        description: "Fill required fields and upload at least one image.",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);

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
        jewelleryTag: item.jewelleryTag || "all",
        size: item.size?.trim() || undefined,
        weight:
          item.weight !== "" && !Number.isNaN(Number(item.weight))
            ? Number.parseFloat(item.weight)
            : undefined,
        isAvailable: item.isAvailable !== false,
        images: item.images,
      };

      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
      );

      await productAPI.create(cleanPayload, accessToken);

      toast({
        title: "Jewellery created",
        description: "This piece will now appear on the storefront.",
        variant: "success",
      });

      router.push("/dashboard/jewellery");
    } catch (error) {
      console.error("Failed to create jewellery", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to create jewellery.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader
        loading={loading}
        onBack={() => router.push("/dashboard/jewellery")}
        onCancel={() => router.push("/dashboard/jewellery")}
        onSave={handleSave}
        canSave={canSave}
        title="Add Jewellery"
        subtitle="Create a piece that will appear on the Gemstones Jewellery page"
        saveLabel="Create Jewellery"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BasicInformationForm product={item} onChange={setItem} />
            <PricingForm product={item} onChange={setItem} />
            <JewelleryDetailsForm product={item} onChange={setItem} />
          </div>
          <div className="lg:col-span-1">
            <ImageUploadSection product={item} onChange={setItem} maxImages={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
