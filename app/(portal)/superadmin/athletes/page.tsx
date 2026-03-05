import { Suspense } from 'react';
import { AthletesPage } from '@/ui/features/athletes';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';

function AthletesSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-10 w-48 rounded-lg bg-muted animate-pulse" />
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}

export default function SuperAdminAthletesPage() {
    return (
        <Suspense fallback={<AthletesSkeleton />}>
            <AthletesPage />
        </Suspense>
    );
}
