'use client';

import { Check, Trophy } from 'lucide-react';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';
import { FetchState } from '@/ui/components/feedback';
import { useFetchList } from '@/ui/hooks/useFetchList';

interface SportItem {
  id: number;
  name: string;
}

interface PSportStepProps {
  eventId: string;
  sportId: string;
  onSelect: (fields: { sportId: string; sportName: string }) => void;
  error?: string;
}

export function PSportStep({ eventId, sportId, onSelect, error }: PSportStepProps) {
const { data: sports, loading, error: fetchErr } = useFetchList<SportItem>(
    eventId ? `/api/participation-stats/sports-by-event/${eventId}` : null,
    (raw: any) => ({ id: raw.id, name: raw.name ?? '' })
  );

  return (
    <div className="space-y-6">
      <StepHeader
        title="ជ្រើសរើសប្រភេទកីឡា"
        subtitle="ជ្រើសរើសប្រភេទកីឡាដែលចូលរួមក្នុងព្រឹត្តិការណ៍នេះ"
      />

      <FetchState
        loading={loading}
        error={fetchErr}
        empty={sports.length === 0}
        emptyMessage="មិនមានប្រភេទកីឡា"
        skeletonCount={6}
        skeletonHeight="h-20"
        skeletonCols={2}
      >
        <Grid cols={2}>
          {sports.map((sport) => {
            const isSelected = sportId === String(sport.id);
            return (
              <button
                key={sport.id}
                type="button"
                onClick={() => onSelect({ sportId: String(sport.id), sportName: sport.name })}
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
                    <Trophy
                      className="h-4 w-4"
                      style={{ color: isSelected ? 'white' : 'var(--reg-indigo-600)' }}
                    />
                  </div>
                  <h3
                    className={`event-card-title ${isSelected ? 'selected' : ''}`}
                    style={{ marginBottom: 0 }}
                  >
                    {sport.name}
                  </h3>
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
