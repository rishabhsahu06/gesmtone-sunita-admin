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

export default function TreatmentCompositionForm({ product, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0C2D48]">
          Treatment & Composition
        </CardTitle>
        <CardDescription>Technical specifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="treatment"
              className="text-sm font-medium text-gray-700"
            >
              Treatment
            </Label>
            <Input
              id="treatment"
              value={product.treatment}
              onChange={(e) => handleChange("treatment", e.target.value)}
              placeholder="e.g., Heat treated, Non-heat treated, Laser Treated etc."
              className="focus:ring-[#0C2D48] focus:border-[#0C2D48]"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="treatmentType"
              className="text-sm font-medium text-gray-700"
            >
              Treatment Type
            </Label>
            <Input
              id="treatmentType"
              value={product.treatmentType}
              onChange={(e) => handleChange("treatmentType", e.target.value)}
              placeholder="Treatment type details"
              className="focus:ring-[#0C2D48] focus:border-[#0C2D48]"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="composition"
            className="text-sm font-medium text-gray-700"
          >
            Composition
          </Label>
          <Input
            id="composition"
            value={product.composition}
            onChange={(e) => handleChange("composition", e.target.value)}
            placeholder="Chemical composition, Natural properties, etc."
            className="focus:ring-[#0C2D48] focus:border-[#0C2D48]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
