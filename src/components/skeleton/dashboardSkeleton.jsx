"use client";

import Skeleton from "react-loading-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden">
      <Skeleton height={36} width={260} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton height={14} width={100} />
              <Skeleton circle height={16} width={16} />
            </CardHeader>
            <CardContent>
              <Skeleton height={28} width={72} className="mb-2" />
              <Skeleton height={12} width={120} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="min-w-0 col-span-1 lg:col-span-4">
          <CardHeader>
            <Skeleton height={22} width={140} />
          </CardHeader>
          <CardContent>
            <Skeleton height={220} className="w-full" />
          </CardContent>
        </Card>
        <Card className="min-w-0 col-span-1 lg:col-span-3">
          <CardHeader>
            <Skeleton height={22} width={120} />
            <Skeleton height={14} width={180} />
          </CardHeader>
          <CardContent className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton circle height={36} width={36} />
                <div className="min-w-0 flex-1">
                  <Skeleton height={14} width="60%" className="mb-2" />
                  <Skeleton height={12} width="80%" />
                </div>
                <Skeleton height={16} width={56} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
