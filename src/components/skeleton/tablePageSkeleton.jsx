"use client";

import Skeleton from "react-loading-skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import ProductListSkeleton from "@/components/skeleton/productSkeleton";

export default function TablePageSkeleton({
  titleWidth = 160,
  showExport = false,
}) {
  return (
    <div className="flex-1 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton height={36} width={titleWidth} />
        <div className="flex gap-2">
          {showExport && <Skeleton height={40} width={120} />}
          <Skeleton height={40} width={120} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton height={22} width={180} className="mb-2" />
          <Skeleton height={14} width={280} />
        </CardHeader>
        <CardContent>
          <Skeleton height={40} width={280} className="mb-4 max-w-full" />
          <ProductListSkeleton rows={8} />
        </CardContent>
      </Card>
    </div>
  );
}
