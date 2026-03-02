'use client';

import { Skeleton } from '@/ui/design-system/primitives/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="animate-in fade-in-50 space-y-8">
      {/* Hero banner skeleton */}
      <Skeleton className="h-44 w-full rounded-3xl" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Two-column panels */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>

      {/* Three-column row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>

      {/* Table skeleton */}
      <Skeleton className="h-56 rounded-2xl" />
    </div>
  );
}
