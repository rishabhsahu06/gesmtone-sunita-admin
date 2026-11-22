"use client";

import Skeleton from "react-loading-skeleton";

export default function ProductListSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-3">
      <div className="hidden md:block overflow-hidden rounded-md border">
        <div className="grid grid-cols-6 gap-4 border-b bg-muted/40 px-4 py-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={14} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-6 gap-4 border-b px-4 py-4 last:border-b-0"
          >
            {Array.from({ length: 6 }).map((_, col) => (
              <Skeleton key={col} height={16} />
            ))}
          </div>
        ))}
      </div>

      <div className="space-y-3 md:hidden">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="rounded-md border border-gray-200 p-4 shadow-sm"
          >
            <Skeleton height={18} width="70%" className="mb-2" />
            <Skeleton height={14} width="45%" className="mb-3" />
            <div className="flex gap-2">
              <Skeleton height={32} width={72} />
              <Skeleton height={32} width={72} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
