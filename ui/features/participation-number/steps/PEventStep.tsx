'use client';

import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';
import { FetchState } from '@/ui/components/feedback';
import { useFetchList } from '@/ui/hooks/useFetchList';

// ── Types ──────────────────────────────────────────────────────

interface EventItem {
  id: number;
  name: string;
  type: string;
}

interface PEventStepProps {
  eventId: string;
  onSelect: (fields: { eventId: string; eventName: string; eventType: string }) => void;
  error?: string;
}

// ── Component ─────────────────────────────────────────────────

export function PEventStep({ eventId, onSelect, error }: PEventStepProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

const { data: allEvents, loading, error: fetchErr } = useFetchList<EventItem>(
    '/api/participation-stats/events-by-type',
    (raw: any) => ({ id: raw.id, name: raw.name ?? raw.name_kh ?? '', type: raw.type ?? '' })
  );

  const types = Array.from(new Set(allEvents.map((e) => e.type).filter(Boolean)));
  const filteredEvents = selectedType ? allEvents.filter((e) => e.type === selectedType) : [];

  // ── Phase 1 — pick type ──
  if (!selectedType) {
    return (
      <div className="space-y-6">
        <StepHeader
          title="ជ្រើសរើសប្រភេទព្រឹត្តិការណ៍"
          subtitle="ជ្រើសរើសប្រភេទព្រឹត្តិការណ៍ដែលអ្នកចង់មើល"
        />
        <FetchState
          loading={loading}
          error={fetchErr}
          empty={types.length === 0}
          emptyMessage="មិនមានព្រឹត្តិការណ៍"
          skeletonCount={4}
          skeletonHeight="h-28"
          skeletonCols={2}
        >
          <Grid cols={2}>
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className="event-card group text-left"
              >
                <h3 className="event-card-title">{type}</h3>
                <p className="event-card-text mt-2 text-sm">
                  {allEvents.filter((e) => e.type === type).length} ព្រឹត្តិការណ៍
                </p>
              </button>
            ))}
          </Grid>
        </FetchState>
        {error && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{error}</p>}
      </div>
    );
  }

  // ── Phase 2 — pick event ──
  return (
    <div className="space-y-6">
      {/* Back to type */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSelectedType(null)}
          className="flex items-center gap-1 text-sm"
          style={{ color: 'var(--reg-indigo-600)' }}
        >
          <ChevronLeft className="h-4 w-4" />
          ត្រលប់
        </button>
        <span style={{ color: 'var(--reg-slate-300)' }}>|</span>
        <span className="text-sm font-medium" style={{ color: 'var(--reg-slate-700)' }}>
          {selectedType}
        </span>
      </div>

      <StepHeader
        title="ជ្រើសរើសព្រឹត្តិការណ៍"
        subtitle="ជ្រើសរើសព្រឹត្តិការណ៍ដែលអ្នកចង់មើល"
      />

      {filteredEvents.length === 0 ? (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--reg-slate-600)' }}>
          មិនមានព្រឹត្តិការណ៍ក្នុងប្រភេទនេះ
        </p>
      ) : (
        <Grid cols={2}>
          {filteredEvents.map((evt) => {
            const isSelected = eventId === String(evt.id);
            return (
              <button
                key={evt.id}
                type="button"
                onClick={() =>
                  onSelect({ eventId: String(evt.id), eventName: evt.name, eventType: evt.type })
                }
                className={`event-card group ${isSelected ? 'selected' : ''}`}
              >
                {isSelected && (
                  <div className="event-card-check">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <h3 className={`event-card-title ${isSelected ? 'selected' : ''}`}>{evt.name}</h3>
              </button>
            );
          })}
        </Grid>
      )}

      {error && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{error}</p>}
    </div>
  );
}
