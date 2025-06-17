"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PhysicalPropertiesForm({ product, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#BA8E49]">Physical Properties</CardTitle>
        <CardDescription>Gemstone specifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
              Weight (g) *
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              value={product.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="1.5g"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weightRatti" className="text-sm font-medium text-gray-700">
              Weight (Ratti)
            </Label>
            <Input
              id="weightRatti"
              type="number"
              step="0.01"
              value={product.weightRatti}
              onChange={(e) => handleChange("weightRatti", e.target.value)}
              placeholder="4.5 Ratti"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weightCarat" className="text-sm font-medium text-gray-700">
              Weight (Carat)
            </Label>
            <Input
              id="weightCarat"
              type="number"
              step="0.01"
              value={product.weightCarat}
              onChange={(e) => handleChange("weightCarat", e.target.value)}
              placeholder="4.2 Carat"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="shape" className="text-sm font-medium text-gray-700">
              Shape
            </Label>
            <Input
              id="shape"
              value={product.shape}
              onChange={(e) => handleChange("shape", e.target.value)}
              placeholder="e.g., Round, Oval"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="colour" className="text-sm font-medium text-gray-700">
              Colour
            </Label>
            <Input
              id="colour"
              value={product.colour}
              onChange={(e) => handleChange("colour", e.target.value)}
              placeholder="e.g., Deep Blue"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specificGravity" className="text-sm font-medium text-gray-700">
              Specific Gravity
            </Label>
            <Input
              id="specificGravity"
              type="number"
              step="0.01"
              value={product.specificGravity}
              onChange={(e) => handleChange("specificGravity", e.target.value)}
              placeholder="e.g 3.5"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
