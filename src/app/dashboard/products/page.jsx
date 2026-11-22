"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productAPI } from "@/lib/api";
import {
  ADMIN_LIST_FIELDS,
  mapStoneListItem,
} from "@/lib/product-form";
import ProductsList from "./ProductsList";
import { useRouter } from "next/navigation";
import useAccessToken from "@/hooks/useSession";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import TablePageSkeleton from "@/components/skeleton/tablePageSkeleton";
import { getListingStatus } from "@/lib/product-status";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebouncedValue(searchTerm, 250);
  const { toast } = useToast();
  const router = useRouter();
  const { accessToken, status } = useAccessToken();

  const fetchProducts = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await productAPI.getAll(accessToken, {
        productType: "gemstone",
        fields: ADMIN_LIST_FIELDS,
      });

      const transformed = (response.data.data || []).map((product) => ({
        ...mapStoneListItem(product),
        status: getListingStatus(product),
      }));

      setProducts(transformed);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch products.",
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, toast]);

  useEffect(() => {
    if (status === "loading") return;
    if (accessToken) fetchProducts();
    else setLoading(false);
  }, [accessToken, status, fetchProducts]);

  const filteredProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.origin?.toLowerCase().includes(term) ||
        product.shape?.toLowerCase().includes(term)
    );
  }, [debouncedSearch, products]);

  const handleEditProduct = (product) => {
    router.push(`/dashboard/products/edit/${product.id}`);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productAPI.delete(id, accessToken);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: "Stone deleted",
        description: "The stone has been removed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Original Price",
      "Discounted Price",
      "Category",
      "Stock",
      "Status",
      "Origin",
      "Shape",
      "Weight",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredProducts.map((product) =>
        [
          product.id,
          `"${(product.name || "").replace(/"/g, '""')}"`,
          product.originalPrice ?? "",
          product.discountedPrice ?? "",
          product.category || "",
          product.stock ?? "",
          product.status || "",
          `"${(product.origin || "").replace(/"/g, '""')}"`,
          product.shape || "",
          product.weight || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stones.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <TablePageSkeleton titleWidth={120} showExport />;
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Stones</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => router.push("/dashboard/products/createProducts")}
            className="bg-[#0C2D48] hover:bg-[#0c2d40] text-white cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Stone
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stones</CardTitle>
          <CardDescription>
            Add stones here. They appear in Find Your Perfect Stone on the
            storefront.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ProductsList
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <p className="text-gray-500">
                {searchTerm
                  ? "No stones found matching your search."
                  : "No stones yet. Add a stone to show it on the website."}
              </p>
              <Button
                onClick={fetchProducts}
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
