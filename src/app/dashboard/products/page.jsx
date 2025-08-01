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
import { Search, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productAPI } from "@/lib/api";
import ProductsList from "./ProductsList";
import { useRouter } from "next/navigation";
import useAccessToken from "@/hooks/useSession";
import ProductListSkeleton from "@/components/skeleton/productSkeleton";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { accessToken } = useAccessToken();

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(accessToken);
      console.log(response.data);

      // Transform API data to match your table structure
      const transformedProducts = response.data.data.map((product) => ({
        id: product._id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.discountedPrice || product.originalPrice,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        category: product.primaryCategory,
        secondaryCategory: product.secondaryCategory,
        stock: product.stock,
        status: product.isAvailable ? "active" : "inactive",
        weight: product.weight,
        weightRatti: product.weightRatti,
        weightCarat: product.weightCarat,
        shape: product.shape,
        origin: product.origin,
        certification: product.certification,
        poojaEnergization: product.poojaEnergization,
        images: product.images,
        videoUrl: product.videoUrl,
        features: product.features,
        productBenefits: product.productBenefits,
        colour: product.colour,
        treatment: product.treatment,
        treatmentType: product.treatmentType,
        composition: product.composition,
        returnPolicy: product.returnPolicy,
        dimensionType: product.dimensionType,
        specificGravity: product.specificGravity,
        dimensions: product.dimensions,
        refractiveIndex: product.refractiveIndex,
        ratings: product.ratings,
        isAvailable: product.isAvailable,
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch products.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "error",
      });
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Navigate to edit page instead of opening dialog
  const handleEditProduct = (product) => {
    const id = product.id;
    router.push(`/dashboard/products/edit/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productAPI.delete(id, accessToken);
      await fetchProducts();
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete product", error);
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
      "Description",
      "Original Price",
      "Discounted Price",
      "Category",
      "Stock",
      "Status",
      "Origin",
      "Shape",
      "Weight",
      "Colour",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredProducts.map((product) =>
        [
          product.id,
          `"${product.name}"`,
          `"${product.description}"`,
          product.originalPrice,
          product.discountedPrice || "",
          product.category,
          product.stock,
          product.status,
          `"${product.origin || ""}"`,
          product.shape || "",
          product.weight || "",
          product.colour || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-300 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-72 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <ProductListSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4 " />
            Export CSV
          </Button>
          <Button
            onClick={() => router.push("/dashboard/products/createProducts")}
            className="bg-[#0C2D48] hover:bg-[#0c2d40] text-white cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-8 space-y-4">
              <p className="text-gray-500">
                No products found matching your search.
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
