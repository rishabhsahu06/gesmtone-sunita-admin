"use client";

import Skeleton from "react-loading-skeleton";

export default function FormPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 -mx-3 sm:-mx-4 -mt-0 space-y-6 p-3 sm:p-4">
      <div className="flex flex-col gap-3 border-b bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton height={28} width={180} className="mb-2" />
          <Skeleton height={14} width={240} />
        </div>
        <div className="flex gap-2">
          <Skeleton height={40} width={90} />
          <Skeleton height={40} width={120} />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white p-6">
              <Skeleton height={22} width={160} className="mb-4" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} className="md:col-span-2" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-white p-6">
          <Skeleton height={22} width={120} className="mb-4" />
          <Skeleton height={180} className="mb-3" />
          <Skeleton height={40} />
        </div>
      </div>
    </div>
  );
}
