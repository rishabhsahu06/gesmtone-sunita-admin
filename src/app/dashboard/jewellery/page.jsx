"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productAPI } from "@/lib/api";
import JewelleryList from "./JewelleryList";
import { useRouter } from "next/navigation";
import useAccessToken from "@/hooks/useSession";
import ProductListSkeleton from "@/components/skeleton/productSkeleton";

export default function JewelleryPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { accessToken, status } = useAccessToken();

  const fetchJewellery = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(accessToken, {
        productType: "jewellery",
      });

      const transformed = (response.data.data || []).map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.discountedPrice || item.originalPrice,
        originalPrice: item.originalPrice,
        discountedPrice: item.discountedPrice,
        jewelleryType: item.jewelleryType,
        metal: item.metal,
        jewelleryTag: item.jewelleryTag,
        goldPurity: item.goldPurity,
        size: item.size,
        stock: item.stock,
        status: item.isAvailable ? "active" : "inactive",
        images: item.images,
        isAvailable: item.isAvailable,
      }));

      setItems(transformed);
      setFilteredItems(transformed);
    } catch (error) {
      console.error("Failed to fetch jewellery", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch jewellery.",
        variant: "error",
      });
      setItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (accessToken) {
      fetchJewellery();
    } else {
      setLoading(false);
    }
  }, [accessToken, status]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredItems(
      items.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.jewelleryType?.toLowerCase().includes(term) ||
          item.metal?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, items]);

  const handleEdit = (item) => {
    router.push(`/dashboard/jewellery/edit/${item.id}`);
  };

  const handleDelete = async (id) => {
    try {
      await productAPI.delete(id, accessToken);
      await fetchJewellery();
      toast({
        title: "Jewellery deleted",
        description: "Item has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete jewellery", error);
      toast({
        title: "Error",
        description: "Failed to delete jewellery.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Jewellery</h2>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-300 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-72 animate-pulse" />
          </CardHeader>
          <CardContent>
            <ProductListSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Jewellery</h2>
        <Button
          onClick={() => router.push("/dashboard/jewellery/create")}
          className="bg-[#0C2D48] hover:bg-[#0c2d40] text-white cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Jewellery
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jewellery Management</CardTitle>
          <CardDescription>
            Add pieces here to show them on the Gemstones Jewellery storefront
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, type, or metal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <JewelleryList
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-8 space-y-4">
              <p className="text-gray-500">
                {searchTerm
                  ? "No jewellery found matching your search."
                  : "No jewellery yet. Add a piece to show it on the website."}
              </p>
              <Button
                onClick={fetchJewellery}
                variant="outline"
                className="cursor-pointer"
              >
                <Search className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
