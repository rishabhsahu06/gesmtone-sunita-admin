"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const PRODUCT_BENEFITS = [
  "Financial Growth",
  "Relationship Growth",
  "Promotes Good Health",
  "Spiritual Growth",
  "Emotional Stability",
  "Success in Education",
  "Career Success",
  "Protection from Negativity",
  "Enhanced Creativity",
  "Chakra Balancing",
  "Manifestation Power",
  "Psychic Abilities",
  "Courage & Confidence",
  "Detoxification",
  "Fertility & Vitality",
  "Better Sleep",
  "Luck & Fortune",
  "Longevity",
  "Astral Travel",
  "Divine Connection",
  "Past Life Recall",
  "Karmic Healing",
  "Aura Cleansing",
  "Grounding & Stability",
  "Enhanced Intuition",
  "Peace & Tranquility",
  "Angelic Communication",
  "DNA Activation",
  "Energy Amplification",
  "Stress Relief",
  "Pain Relief",
  "Enhanced Focus",
  "Protection from Electromagnetic (EMF) Radiation",
  "Dream Recall & Interpretation",
  "Enhanced Meditation",
  "Self-Discovery",
  "Transmutation of Negative Energy",
  "Other",
]

export default function AdditionalDetailsForm({ product, onChange }) {
  const [customBenefit, setCustomBenefit] = useState("")

  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value })
  }

  const handleDimensionChange = (dimension, value) => {
    const numericValue = value === "" ? "" : parseFloat(value)
    onChange({
      ...product,
      dimensions: {
        ...product.dimensions,
        [dimension]: numericValue
      }
    })
  }

  const addBenefit = (benefit) => {
    if (!product.productBenefits.includes(benefit)) {
      handleChange("productBenefits", [...product.productBenefits, benefit])
    }
  }

  const removeBenefit = (index) => {
    handleChange(
      "productBenefits",
      product.productBenefits.filter((_, i) => i !== index),
    )
  }

  const addCustomBenefit = () => {
    if (customBenefit.trim() && !product.productBenefits.includes(customBenefit.trim())) {
      addBenefit(customBenefit.trim())
      setCustomBenefit("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#BA8E49]">Additional Details</CardTitle>
        <CardDescription>Other product information and dimensions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dimensions Section */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Product Dimensions (mm)
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              Enter the physical dimensions of the product
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length" className="text-sm font-medium text-gray-700">
                Length (mm)
              </Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                min="0"
                value={product.dimensions?.length || ""}
                onChange={(e) => handleDimensionChange("length", e.target.value)}
                placeholder="e.g., 9.2"
                className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                Width (mm)
              </Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                min="0"
                value={product.dimensions?.width || ""}
                onChange={(e) => handleDimensionChange("width", e.target.value)}
                placeholder="e.g., 7.5"
                className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                Height (mm)
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                min="0"
                value={product.dimensions?.height || ""}
                onChange={(e) => handleDimensionChange("height", e.target.value)}
                placeholder="e.g., 4.0"
                className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
              />
            </div>
          </div>
          
          {/* Display current dimensions */}
          {(product.dimensions?.length || product.dimensions?.width || product.dimensions?.height) && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Current dimensions:</span>{" "}
                {product.dimensions?.length || "0"} × {product.dimensions?.width || "0"} × {product.dimensions?.height || "0"} mm
                <span className="text-xs text-gray-500 ml-2">(L × W × H)</span>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dimensionType" className="text-sm font-medium text-gray-700">
              Dimension Type
            </Label>
            <Input
              id="dimensionType"
              value={product.dimensionType}
              onChange={(e) => handleChange("dimensionType", e.target.value)}
              placeholder="e.g., Not Calibrated, Calibrated, Certified, etc."
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="returnPolicy" className="text-sm font-medium text-gray-700">
              Return Policy
            </Label>
            <Input
              id="returnPolicy"
              value={product.returnPolicy}
              onChange={(e) => handleChange("returnPolicy", e.target.value)}
              placeholder="e.g., 30 days return"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productBenefits" className="text-sm font-medium text-gray-700">
            Product Benefits
          </Label>
          <Select onValueChange={addBenefit}>
            <SelectTrigger className="focus:ring-[#BA8E49] focus:border-[#BA8E49]">
              <SelectValue placeholder="Select or add benefits" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_BENEFITS.map((benefit) => (
                <SelectItem key={benefit} value={benefit}>
                  {benefit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              value={customBenefit}
              onChange={(e) => setCustomBenefit(e.target.value)}
              placeholder="Enter custom benefit"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
            <Button type="button" variant="outline" onClick={addCustomBenefit} className="shrink-0">
              Add
            </Button>
          </div>

          {product.productBenefits.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Selected Benefits:</p>
              <div className="flex flex-wrap gap-2">
                {product.productBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-[#BA8E49]/10 text-[#BA8E49] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{benefit.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-[#BA8E49] hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAvailable"
            checked={product.isAvailable}
            onCheckedChange={(checked) => handleChange("isAvailable", checked)}
            className="data-[state=checked]:bg-[#BA8E49] data-[state=checked]:border-[#BA8E49]"
          />
          <Label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
            Product is available for sale
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}