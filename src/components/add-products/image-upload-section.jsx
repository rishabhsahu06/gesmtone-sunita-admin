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

export default function ImageUploadSection({ product, onChange }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [altText, setAltText] = useState("");
  const { toast } = useToast();
  const { accessToken } = useAccessToken();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile || !accessToken) return;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("media", selectedFile);

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

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data?.url) {
        // Create image object with URL and alt text
        const imageObject = {
          url: result.data.url,
          alt: altText.trim() || `Product image ${product.images.length + 1}`,
        };

        // Add the new image object to the product's images array
        onChange({
          ...product,
          images: [...product.images, imageObject],
        });

        // Reset the file selection and alt text
        setSelectedFile(null);
        setPreviewUrl(null);
        setAltText("");

        // Reset the file input
        const fileInput = document.getElementById("image-upload");
        if (fileInput) {
          fileInput.value = "";
        }

        toast({
          title: "Image uploaded",
          description: "Image has been successfully uploaded.",
        });
      } else {
        throw new Error("Upload response was not successful");
      }
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
    setSelectedFile(null);
    setAltText("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    // Reset the file input
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
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
        <CardTitle className="text-[#0C2D48]">Product Images</CardTitle>
        <CardDescription>
          Upload high-quality images of your product (one at a time)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0C2D48] transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploadingImage}
          />

          {!selectedFile ? (
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-[#0C2D48]">
                  Click to select image
                </span>
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              {/* Preview of selected image */}
              {previewUrl && (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
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
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              {/* Alt Text Input */}
              <div className="space-y-2 text-left">
                <Label
                  htmlFor="alt-text"
                  className="text-sm font-medium text-gray-700"
                >
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
                  Optional: Describe the image for better accessibility and
                  organization
                </p>
              </div>

              {/* Upload Button */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleUpload}
                  disabled={uploadingImage || !accessToken}
                  className="bg-[#0C2D48] hover:bg-[#A67B3C] text-white"
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

                <Button
                  variant="outline"
                  onClick={clearSelection}
                  disabled={uploadingImage}
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
              Uploaded Images ({product.images.length})
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
                  {imageObj.alt && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                      {imageObj.alt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Images State */}
        {product.images.length === 0 && !selectedFile && (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No images uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
