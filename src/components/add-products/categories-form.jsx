"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRIMARY_CATEGORIES = [
  {
    id: "pink-sapphire",
    name: "Pink Sapphire",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
  {
    id: "blue-sapphire",
    name: "Blue Sapphire",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750251219/gemstone-uploads/file_r8itp7.jpg",
  },
  {
    id: "yellow-sapphire",
    name: "Yellow Sapphire",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750257954/gemstone-uploads/file_ruakf7.jpg`",
  },
  {
    id: "red-coral",
    name: "Red Coral",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750264683/gemstone-uploads/file_tq1105.webp",
  },
  {
    id: "pearl",
    name: "Pearl",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750265156/gemstone-uploads/file_tkdksf.webp",
  },
  {
    id: "hessonite",
    name: "Hessonite",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750265265/gemstone-uploads/file_eorpc0.jpg",
  },
  {
    id: "ruby",
    name: "Ruby",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750265528/gemstone-uploads/file_ouixaj.webp",
  },
  {
    id: "emerald",
    name: "Emerald",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750358392/gemstone-uploads/file_qhih1t.png",
  },
  {
    id: "diamond",
    name: "Diamond",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750359273/gemstone-uploads/file_zasnyo.png",
  },
  {
    id: "opal",
    name: "Opal",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750359399/gemstone-uploads/file_dxwyk7.png",
  },
  {
    id: "amethyst",
    name: "Amethyst",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750359718/gemstone-uploads/file_qtlcdu.png",
  },
  {
    id: "topaz",
    name: "Topaz",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750359762/gemstone-uploads/file_mrc69h.png",
  },
  {
    id: "garnet",
    name: "Garnet",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750359790/gemstone-uploads/file_zlmzzw.png",
  },
  {
    id: "tanzanite",
    name: "Tanzanite",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750359831/gemstone-uploads/file_vuly1o.png",
  },
  {
    id: "aquamarine",
    name: "Aquamarine",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750359859/gemstone-uploads/file_kjw17o.png",
  },
  {
    id: "peridot",
    name: "Peridot",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750359904/gemstone-uploads/file_r9uwxm.png",
  },
  {
    id: "tourmaline",
    name: "Tourmaline",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750389894/gemstone-uploads/file_io3hna.png",
  },
  {
    id: "citrine",
    name: "Citrine",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750389940/gemstone-uploads/file_qxsnfs.png",
  },
  {
    id: "moonstone",
    name: "Moonstone",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750389971/gemstone-uploads/file_bjm3yx.png",
  },
  {
    id: "alexandrite",
    name: "Alexandrite",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390002/gemstone-uploads/file_m0hf8m.png",
  },
  {
    id: "lapis-lazuli",
    name: "Lapis Lazuli",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390036/gemstone-uploads/file_qp6ai9.png",
  },
  {
    id: "turquoise",
    name: "Turquoise",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390061/gemstone-uploads/file_gc3xwh.png",
  },
  {
    id: "spinel",
    name: "Spinel",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390092/gemstone-uploads/file_lho9fn.png",
  },
  {
    id: "iolite",
    name: "Iolite",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390124/gemstone-uploads/file_zywlwg.png",
  },
  {
    id: "zircon",
    name: "Zircon",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390149/gemstone-uploads/file_adhbpp.png",
  },
  {
    id: "chrysoberyl",
    name: "Chrysoberyl",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390176/gemstone-uploads/file_jmeml8.png",
  },
  {
    id: "kyanite",
    name: "Kyanite",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390210/gemstone-uploads/file_tgxcnk.png",
  },
  {
    id: "sodalite",
    name: "Sodalite",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1750390239/gemstone-uploads/file_tlvpka.png",
  },
  {
    id: "other-gemstones",
    name: "Other",
    image:
      "https://res.cloudinary.com/dtcq8v9za/image/upload/v1749552629/gemstone-uploads/file_kfzeam.webp",
  },
];

const SECONDARY_CATEGORIES = [
  "gemstone-rings",
  "gemstone-pendants",
  "loose-gemstones",
  "gemstone-bracelets",
  "none",
];

export default function CategoriesForm({ product, onChange }) {
  const handleChange = (field, value) => {
    if (field === "primaryCategory") {
      const selectedCategory = PRIMARY_CATEGORIES.find(
        (cat) => cat.id === value
      );
      onChange({
        ...product,
        primaryCategory: value,
        primaryCategoryImage: selectedCategory?.image || "",
      });
    } else {
      onChange({ ...product, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0C2D48]">Categories</CardTitle>
        <CardDescription>Organize your product</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="primaryCategory"
              className="text-sm font-medium text-gray-700"
            >
              Primary Category (e.g. Blue Sapphire, Ruby, etc) *
            </Label>
            <Select
              value={product.primaryCategory}
              onValueChange={(value) => handleChange("primaryCategory", value)}
            >
              <SelectTrigger className="focus:ring-[#0C2D48] focus:border-[#0C2D48]">
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
            <Label
              htmlFor="secondaryCategory"
              className="text-sm font-medium text-gray-700"
            >
              Secondary Category
            </Label>
            <Select
              value={product.secondaryCategory}
              onValueChange={(value) =>
                handleChange("secondaryCategory", value)
              }
            >
              <SelectTrigger className="focus:ring-[#0C2D48] focus:border-[#0C2D48]">
                <SelectValue placeholder="Select secondary category" />
              </SelectTrigger>
              <SelectContent>
                {SECONDARY_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
