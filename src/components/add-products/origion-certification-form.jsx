"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function OriginCertificationForm({ product, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#BA8E49]">Origin & Certification</CardTitle>
        <CardDescription>Authentication details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium text-gray-700">
              Origin
            </Label>
            <Input
              id="origin"
              value={product.origin}
              onChange={(e) => handleChange("origin", e.target.value)}
              placeholder="e.g., Sri Lanka, Myanmar"
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="certification" className="text-sm font-medium text-gray-700">
              Certification
            </Label>
            <Input
              id="certification"
              value={product.certification}
              onChange={(e) => handleChange("certification", e.target.value)}
              placeholder="e.g. Free Lab Certificate,Govt Lab Certificate ,IGI, GIA, etc."
              className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="poojaEnergization" className="text-sm font-medium text-gray-700">
            Pooja Energization
          </Label>
          <Input
            id="poojaEnergization"
            value={product.poojaEnergization}
            onChange={(e) => handleChange("poojaEnergization", e.target.value)}
            placeholder="e.g. No Energization, With Energization, etc."
            className="focus:ring-[#BA8E49] focus:border-[#BA8E49]"
          />
        </div>
      </CardContent>
    </Card>
  )
}
