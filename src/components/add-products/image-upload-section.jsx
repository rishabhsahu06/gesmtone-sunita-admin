"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import useAccessToken from "@/hooks/useSession";
import { compressImage } from "@/lib/compress-image";

export default function ImageUploadSection({ product, onChange, maxImages, title = "Product Images" }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [altText, setAltText] = useState("");
  const { toast } = useToast();
  const { accessToken } = useAccessToken();

  const uploadedCount = product.images?.length || 0;
  const pendingCount = selectedFiles.length;
  const slotsLeft =
    typeof maxImages === "number"
      ? Math.max(0, maxImages - uploadedCount - pendingCount)
      : null;
  const atLimit = slotsLeft === 0;

  const clearSelectedFiles = () => {
    setSelectedFiles((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    setAltText("");
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleFileSelect = (event) => {
    const incoming = Array.from(event.target.files || []);
    event.target.value = "";
    if (!incoming.length) return;

    const room =
      typeof maxImages === "number"
        ? maxImages - uploadedCount - pendingCount
        : incoming.length;

    if (room <= 0) {
      toast({
        title: "Photo limit reached",
        description: `You can add up to ${maxImages} photos.`,
        variant: "destructive",
      });
      return;
    }

    const accepted = [];
    for (const file of incoming.slice(0, room)) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image.`,
          variant: "destructive",
        });
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 20MB.`,
          variant: "destructive",
        });
        continue;
      }
      accepted.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (incoming.length > room) {
      toast({
        title: "Some photos were skipped",
        description: `Only ${room} more photo${room === 1 ? "" : "s"} can be added.`,
      });
    }

    if (accepted.length) {
      setSelectedFiles((current) => [...current, ...accepted]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !accessToken) return;

    setUploadingImage(true);

    try {
      const uploaded = [];

      for (let index = 0; index < selectedFiles.length; index += 1) {
        const { file } = selectedFiles[index];
        const optimizedFile = await compressImage(file);
        const formData = new FormData();
        formData.append("media", optimizedFile);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload-media`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success || !result.data?.url) {
          throw new Error(
            result.message ||
              result.error ||
              `Upload failed (${response.status}). Try a smaller JPG or PNG.`
          );
        }

        const imageNumber = product.images.length + index;
        uploaded.push({
          url: result.data.url,
          alt:
            imageNumber === 0
              ? altText.trim() || "Main photo"
              : `Phase ${imageNumber + 1}`,
        });
      }

      onChange({
        ...product,
        images: [...product.images, ...uploaded],
      });

      clearSelectedFiles();

      toast({
        title: uploaded.length === 1 ? "Image uploaded" : "Images uploaded",
        description:
          uploaded.length === 1
            ? "Image has been successfully uploaded."
            : `${uploaded.length} photos have been uploaded.`,
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const clearSelection = () => {
    clearSelectedFiles();
  };

  const removeImage = (index) => {
    onChange({
      ...product,
      images: product.images.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-[#0C2D48]">
          {title} <span className="text-red-500">*</span>
        </CardTitle>
        <CardDescription>
          {typeof maxImages === "number"
            ? `Add up to ${maxImages} photos. ${uploadedCount} of ${maxImages} uploaded.`
            : "Upload high-quality images of your product (one at a time)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0C2D48] transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple={typeof maxImages === "number"}
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploadingImage || atLimit}
          />

          {selectedFiles.length === 0 ? (
            atLimit ? (
              <div className="text-sm text-gray-600">
                All {maxImages} photo slots are filled. Remove one to add another.
              </div>
            ) : (
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-[#0C2D48]">
                  {typeof maxImages === "number"
                    ? `Click to select up to ${slotsLeft} photo${slotsLeft === 1 ? "" : "s"}`
                    : "Click to select image"}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </div>
            </label>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-3">
                {selectedFiles.map((item, index) => {
                  const imageNumber = uploadedCount + index;
                  const phaseLabel =
                    imageNumber === 0 ? "Main" : `Phase ${imageNumber + 1}`;
                  return (
                  <div key={item.previewUrl} className="relative">
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <span className="mt-1 block text-[10px] font-medium text-gray-500">
                      {phaseLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(item.previewUrl);
                        setSelectedFiles((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index)
                        );
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={uploadingImage}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  );
                })}
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  {selectedFiles.length} photo{selectedFiles.length === 1 ? "" : "s"} selected
                </p>
              </div>

              {uploadedCount === 0 && (
                <div className="space-y-2 text-left">
                  <Label
                    htmlFor="alt-text"
                    className="text-sm font-medium text-gray-700"
                  >
                    Main photo description
                  </Label>
                  <Input
                    id="alt-text"
                    type="text"
                    placeholder="Short description for the first photo"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    disabled={uploadingImage}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Only the first photo uses this description. Extra photos are saved as Phase 2, Phase 3, and Phase 4.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploadingImage || !accessToken}
                  className="w-full bg-[#0C2D48] hover:bg-[#A67B3C] text-white"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedFiles.length > 1
                        ? `Upload ${selectedFiles.length} photos`
                        : "Upload Image"}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={clearSelection}
                  disabled={uploadingImage}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Uploaded Images Display */}
        {product.images.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Uploaded Images ({product.images.length}
              {typeof maxImages === "number" ? ` / ${maxImages}` : ""})
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {product.images.map((imageObj, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={imageObj.url}
                      alt={imageObj.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {/* Show alt text on hover or below image */}
                  <p className="mt-1 text-center text-[10px] font-medium text-gray-500">
                    {index === 0 ? "Main" : `Phase ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Images State */}
        {product.images.length === 0 && selectedFiles.length === 0 && (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No images uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
