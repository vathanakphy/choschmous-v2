'use client';

import { Check, Building2 } from 'lucide-react';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';
import { FetchState } from '@/ui/components/feedback';
import { useFetchList } from '@/ui/hooks/useFetchList';

interface OrgItem {
  id: number;
  name: string;
  type: string;
}

interface POrgStepProps {
  eventId: string;
  organizationId: string;
  onSelect: (fields: { organizationId: string; organizationName: string; organizationType: string }) => void;
  error?: string;
}

export function POrgStep({ eventId, organizationId, onSelect, error }: POrgStepProps) {
  if (!eventId) return null;

  const { data: orgs, loading, error: fetchErr } = useFetchList<OrgItem>(
    eventId ? `/api/participation-stats/organizations-by-event/${eventId}` : null,
    (raw: any) => ({ id: raw.id, name: raw.name ?? '', type: raw.type ?? '' })
  );

  return (
    <div className="space-y-6">
      <StepHeader
        title="ជ្រើសរើសខេត្ត / ស្ថាប័ន"
        subtitle="ជ្រើសរើសខេត្ត ឬស្ថាប័នដែលចូលរួមក្នុងព្រឹត្តិការណ៍នេះ"
      />

      <FetchState
        loading={loading}
        error={fetchErr}
        empty={orgs.length === 0}
        emptyMessage="មិនមានខេត្ត / ស្ថាប័ន"
        skeletonCount={6}
        skeletonHeight="h-24"
        skeletonCols={2}
      >
        <Grid cols={2}>
          {orgs.map((org) => {
            const isSelected = organizationId === String(org.id);
            return (
              <button
                key={org.id}
                type="button"
                onClick={() =>
                  onSelect({
                    organizationId: String(org.id),
                    organizationName: org.name,
                    organizationType: org.type,
                  })
                }
                className={`event-card group ${isSelected ? 'selected' : ''}`}
              >
                {isSelected && (
                  <div className="event-card-check">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: isSelected ? 'var(--reg-indigo-600)' : 'var(--reg-indigo-50)',
                    }}
                  >
                    <Building2
                      className="h-4 w-4"
                      style={{ color: isSelected ? 'white' : 'var(--reg-indigo-600)' }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`event-card-title truncate ${isSelected ? 'selected' : ''}`}
                      style={{ marginBottom: 0 }}
                    >
                      {org.name}
                    </h3>
                    {org.type && (
                      <p
                        className="mt-0.5 text-xs font-medium tracking-wide uppercase"
                        style={{
                          color: isSelected ? 'var(--reg-indigo-600)' : 'var(--reg-slate-500)',
                        }}
                      >
                        {org.type === 'province' ? 'ខេត្ត / រាជធានី' : 'ក្រសួង / ស្ថាប័ន'}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </Grid>
      </FetchState>

      {error && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{error}</p>}
    </div>
  );
}
