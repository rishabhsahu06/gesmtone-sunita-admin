"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PRIMARY_CATEGORIES = [
  {
    id: "pink-sapphire",
    name: "Pink Sapphire",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "blue-sapphire",
    name: "Blue Sapphire",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "yellow-sapphire",
    name: "Yellow Sapphire",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "red-coral",
    name: "Red Coral",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "pearl",
    name: "Pearl",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "hessonite",
    name: "Hessonite",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "ruby",
    name: "Ruby",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "emerald",
    name: "Emerald",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "diamond",
    name: "Diamond",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "opal",
    name: "Opal",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "amethyst",
    name: "Amethyst",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "topaz",
    name: "Topaz",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "garnet",
    name: "Garnet",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "tanzanite",
    name: "Tanzanite",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "aquamarine",
    name: "Aquamarine",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "peridot",
    name: "Peridot",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "tourmaline",
    name: "Tourmaline",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "citrine",
    name: "Citrine",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "moonstone",
    name: "Moonstone",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "alexandrite",
    name: "Alexandrite",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "lapis-lazuli",
    name: "Lapis Lazuli",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "turquoise",
    name: "Turquoise",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "spinel",
    name: "Spinel",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "iolite",
    name: "Iolite",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "zircon",
    name: "Zircon",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "chrysoberyl",
    name: "Chrysoberyl",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "kyanite",
    name: "Kyanite",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "sodalite",
    name: "Sodalite",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "other",
    name: "Other",
    image: "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
]

const SECONDARY_CATEGORIES = ["gemstone-rings", "gemstone-pendants", "loose-gemstones", "gemstone-bracelets", "none"]

export default function CategoriesForm({ product, onChange }) {
  const handleChange = (field, value) => {
    if (field === "primaryCategory") {
      const selectedCategory = PRIMARY_CATEGORIES.find((cat) => cat.id === value)
      onChange({
        ...product,
        primaryCategory: value,
        primaryCategoryImage: selectedCategory?.image || "",
      })
    } else {
      onChange({ ...product, [field]: value })
    }
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
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
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
