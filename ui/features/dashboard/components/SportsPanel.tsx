'use client';

import Link from 'next/link';
import { Medal, ArrowRight } from 'lucide-react';
import { Badge } from '@/ui/design-system/primitives/Badge';
import { Button } from '@/ui/design-system/primitives/Button';
import type { DashboardSport } from '../types/Dashboard.types';

type SportsPanelProps = {
  sports: DashboardSport[];
  isLoading: boolean;
  sportsRoute: string;
  sportRoute: (id: string) => string;
};

export function SportsPanel({ sports, isLoading, sportsRoute, sportRoute }: SportsPanelProps) {
  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-chart-2/15 flex h-8 w-8 items-center justify-center rounded-lg">
            <Medal className="text-chart-2 h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold">កីឡាថ្មីៗ</h2>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={sportsRoute}>
            មើលទាំងអស់ <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {!isLoading && sports.length === 0 && (
          <p className="bg-muted text-muted-foreground rounded-xl px-4 py-8 text-center text-sm">
            មិនមានកំណត់ត្រាកីឡាទេ។
          </p>
        )}

        {sports.map((sport) => (
          <Link
            key={sport.id}
            href={sportRoute(String(sport.id))}
            className="group bg-background hover:bg-muted/40 flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/8 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Medal className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground font-medium">{sport.name}</p>
                {sport.sportType && (
                  <Badge variant="outline" className="mt-0.5 text-[10px]">
                    {sport.sportType}
                  </Badge>
                )}
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
