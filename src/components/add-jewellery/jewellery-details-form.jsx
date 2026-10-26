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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { JEWELLERY_TAGS, JEWELLERY_TYPES } from "@/lib/jewellery";

export default function JewelleryDetailsForm({ product, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0C2D48]">Jewellery Details</CardTitle>
        <CardDescription>
          Type and listing details shown on the storefront
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jewelleryType" className="text-sm font-medium text-gray-700">
              Jewellery Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={product.jewelleryType}
              onValueChange={(value) => handleChange("jewelleryType", value)}
            >
              <SelectTrigger className="focus:ring-[#0C2D48] focus:border-[#0C2D48]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {JEWELLERY_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jewelleryTag" className="text-sm font-medium text-gray-700">
              Storefront Tag
            </Label>
            <Select
              value={product.jewelleryTag || "all"}
              onValueChange={(value) => handleChange("jewelleryTag", value)}
            >
              <SelectTrigger className="focus:ring-[#0C2D48] focus:border-[#0C2D48]">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                {JEWELLERY_TAGS.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size" className="text-sm font-medium text-gray-700">
              Size
            </Label>
            <Input
              id="size"
              value={product.size}
              onChange={(e) => handleChange("size", e.target.value)}
              placeholder="e.g. 16, Adjustable"
              className="focus:ring-[#0C2D48] focus:border-[#0C2D48]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
              Weight (g)
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              value={product.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="e.g. 4.5"
              className="focus:ring-[#0C2D48] focus:border-[#0C2D48]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAvailable"
            checked={product.isAvailable}
            onCheckedChange={(checked) => handleChange("isAvailable", Boolean(checked))}
            className="data-[state=checked]:bg-[#0C2D48] data-[state=checked]:border-[#0C2D48]"
          />
          <Label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
            Available for sale on the storefront
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
