"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PricingForm({ product, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#BA8E49]">Pricing</CardTitle>
        <CardDescription>Set your product pricing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="originalPrice" className="text-sm font-medium text-gray-700">
              Original Price *
            </Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              value={product.originalPrice}
              onChange={(e) => handleChange("originalPrice", e.target.value)}
              placeholder="₹3499"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountedPrice" className="text-sm font-medium text-gray-700">
              Discounted Price (this will be shown as sale price)
            </Label>
            <Input
              id="discountedPrice"
              type="number"
              step="0.01"
              value={product.discountedPrice}
              onChange={(e) => handleChange("discountedPrice", e.target.value)}
              placeholder="₹2999"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
