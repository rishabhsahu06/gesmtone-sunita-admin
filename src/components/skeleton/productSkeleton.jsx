// components/ProductListSkeleton.tsx
"use client"

export default function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse flex items-center justify-between border border-gray-200 rounded-md p-4 shadow-sm"
        >
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-20 bg-gray-300 rounded" />
            <div className="h-8 w-20 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
