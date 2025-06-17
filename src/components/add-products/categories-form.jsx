"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PRIMARY_CATEGORIES = [
  "pink-sapphire",
  "blue-sapphire",
  "yellow-sapphire",
  "red-coral",
  "pearl",
  "hessonite",
  "ruby",
  "emerald",
  "diamond",
  "opal",
  "amethyst",
  "topaz",
  "garnet",
  "tanzanite",
  "aquamarine",
  "peridot",
  "tourmaline",
  "citrine",
  "moonstone",
  "alexandrite",
  "lapis-lazuli",
  "turquoise",
  "spinel",
  "iolite",
  "zircon",
  "chrysoberyl",
  "kyanite",
  "sodalite",
  "other",
]

const SECONDARY_CATEGORIES = ["gemstone-rings", "gemstone-pendants", "loose-gemstones", "gemstone-bracelets", "none"]

export default function CategoriesForm({ product, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#BA8E49]">Categories</CardTitle>
        <CardDescription>Organize your product</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primaryCategory" className="text-sm font-medium text-gray-700">
              Primary Category (e.g. Blue Sapphire, Ruby, etc) *
            </Label>
            <Select value={product.primaryCategory} onValueChange={(value) => handleChange("primaryCategory", value)}>
              <SelectTrigger className="focus:ring-[#BA8E49] focus:border-[#BA8E49]">
                <SelectValue placeholder="Select primary category" />
              </SelectTrigger>
              <SelectContent>
                {PRIMARY_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryCategory" className="text-sm font-medium text-gray-700">
              Secondary Category
            </Label>
            <Select
              value={product.secondaryCategory}
              onValueChange={(value) => handleChange("secondaryCategory", value)}
            >
              <SelectTrigger className="focus:ring-[#BA8E49] focus:border-[#BA8E49]">
                <SelectValue placeholder="Select secondary category" />
              </SelectTrigger>
              <SelectContent>
                {SECONDARY_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
