"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BasicInformationForm({ product, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0C2D48]">Basic Information</CardTitle>
        <CardDescription>Essential product details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Product Name *
            </Label>
            <Input
              id="name"
              value={product.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter product name"
              className="focus:ring-[#0C2D48] focus:border-[#0C2D48]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="stock"
              className="text-sm font-medium text-gray-700"
            >
              Stock Quantity *
            </Label>
            <Input
              id="stock"
              type="number"
              value={product.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              placeholder="0"
              className="focus:ring-[#0C2D48] focus:border-[#0C2D48]"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </Label>
          <Textarea
            id="description"
            value={product.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe your product..."
            rows={4}
            className="focus:ring-[#0C2D48] focus:border-[#0C2D48]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
