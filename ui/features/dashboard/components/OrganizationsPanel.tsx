'use client';

import { Building2, MapPinned } from 'lucide-react';
import { Badge } from '@/ui/design-system/primitives/Badge';
import type { TopOrganization } from '../types/Dashboard.types';

type OrganizationsPanelProps = {
  organizations: TopOrganization[];
  isLoading: boolean;
};

export function OrganizationsPanel({ organizations, isLoading }: OrganizationsPanelProps) {
  const maxParticipants = organizations.length
    ? Math.max(...organizations.map((o) => o.participants))
    : 1;

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="bg-chart-3/15 flex h-8 w-8 items-center justify-center rounded-lg">
          <Building2 className="text-chart-3 h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold">ស្ថាប័នកំពូល</h2>
      </div>

      <div className="space-y-3">
        {!isLoading && organizations.length === 0 && (
          <p className="text-muted-foreground text-sm">មិនទាន់មានទិន្នន័យស្ថាប័នទេ។</p>
        )}

        {organizations.map((org, i) => (
          <div key={org.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="bg-primary/10 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                  {i + 1}
                </span>
                <p className="text-foreground truncate text-sm font-medium">
                  <MapPinned className="text-primary/60 mr-1 inline h-3.5 w-3.5" />
                  {org.name}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {org.type && (
                  <Badge variant="outline" className="text-[10px]">
                    {org.type}
                  </Badge>
                )}
                <span className="text-muted-foreground text-xs font-semibold">
                  {org.participants}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <div
                className="bg-primary/60 h-full rounded-full transition-all duration-500"
                style={{ width: `${(org.participants / maxParticipants) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
