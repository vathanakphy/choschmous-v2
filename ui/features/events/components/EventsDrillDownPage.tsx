'use client';

import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useFetchList } from '@/ui/hooks/useFetchList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
import { Button } from '@/ui/design-system/primitives/Button';
import { Badge } from '@/ui/design-system/primitives/Badge';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import { Grid } from '@/ui/components/layout/LayoutPrimitives';

type EventItem = {
  id: number;
  name: string;
  type: string;
  createdAt: string;
};

const mapEvent = (raw: any): EventItem => ({
  id: raw.id,
  name: raw.name ?? raw.name_kh ?? '',
  type: raw.type ?? '',
  createdAt: raw.created_at ?? raw.createdAt ?? '',
});

interface EventsDrillDownPageProps {
  role: 'admin' | 'superadmin';
}

export function EventsDrillDownPage({ role }: EventsDrillDownPageProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Fetch all events once
  const { data: events, loading } = useFetchList<EventItem>(
    `${ROUTES.API.EVENTS}?limit=500`,
    mapEvent
  );

  // Derive unique types
  const types = useMemo(() => {
    const typeSet = new Set(events.map((e) => e.type).filter(Boolean));
    return Array.from(typeSet).map((type) => ({
      type,
      count: events.filter((e) => e.type === type).length,
    }));
  }, [events]);

  // Filter events by selected type
  const filteredEvents = useMemo(() => {
    return selectedType ? events.filter((e) => e.type === selectedType) : [];
  }, [events, selectedType]);

  // Reset selections
  const handleBackToTypes = () => {
    setSelectedType(null);
    setSelectedEvent(null); 
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
  };

  // View: Event Detail
  if (selectedEvent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackToEvents}>
            <ChevronLeft className="h-4 w-4" />
            ត្រលប់
          </Button>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm font-medium">{selectedType}</span>
          <span className="text-muted-foreground">›</span>
          <span className="text-sm font-medium">{selectedEvent.name}</span>
        </div>

        <PageHeader
          title={selectedEvent.name}
          subtitle={`ព្រឹត្តិការណ៍: ${selectedType}`}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">ព័ត៌មានទូទៅ</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ឈ្មោះ:</dt>
                <dd className="font-medium">{selectedEvent.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ប្រភេទ:</dt>
                <dd>
                  <Badge variant="secondary">{selectedEvent.type}</Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">កាលបរិច្ឆេទបង្កើត:</dt>
                <dd className="text-muted-foreground">
                  {new Date(selectedEvent.createdAt).toLocaleDateString('km-KH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            </dl>
          </div>

          {/* Placeholder sections for future expansion */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">កីឡា & ប្រភេទ</h3>
            <p className="text-sm text-muted-foreground">
              ទិន្នន័យកីឡា និងប្រភេទនឹងត្រូវបង្ហាញនៅទីនេះ
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">អ្នកចូលរួម</h3>
            <p className="text-sm text-muted-foreground">
              បញ្ជីអ្នកចូលរួមនឹងត្រូវបង្ហាញនៅទីនេះ
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">មេដាយ</h3>
            <p className="text-sm text-muted-foreground">
              ពិន្ទុមេដាយនឹងត្រូវបង្ហាញនៅទីនេះ
            </p>
          </div>
        </div>

        {role === 'superadmin' && (
          <div className="flex justify-end gap-3 border-t pt-6">
            <Button variant="outline">
              <Calendar className="h-4 w-4" />
              កែប្រែព័ត៌មាន
            </Button>
          </div>
        )}
      </div>
    );
  }

  // View: Event List (after type selection)
  if (selectedType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackToTypes}>
            <ChevronLeft className="h-4 w-4" />
            ត្រលប់
          </Button>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm font-medium">{selectedType}</span>
        </div>

        <PageHeader
          title="ជ្រើសរើសព្រឹត្តិការណ៍"
          subtitle={`${filteredEvents.length} ព្រឹត្តិការណ៍ក្នុងប្រភេទនេះ`}
        />

        {filteredEvents.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-12 w-12" />}
            title="មិនមានព្រឹត្តិការណ៍"
            description="មិនមានព្រឹត្តិការណ៍ក្នុងប្រភេទនេះ"
          />
        ) : (
          <Grid cols={2}>
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEvent(event)}
                className="group rounded-xl border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                      {event.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      បង្កើតនៅ: {new Date(event.createdAt).toLocaleDateString('km-KH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </button>
            ))}
          </Grid>
        )}
      </div>
    );
  }

  // View: Type Selection (default)
  return (
    <div className="space-y-6">
      <PageHeader
        title="ព្រឹត្តិការណ៍"
        subtitle="ជ្រើសរើសប្រភេទព្រឹត្តិការណ៍ដើម្បីចាប់ផ្តើម"
        action={
          role === 'superadmin' ? (
            <Button asChild>
              <a href={ROUTES.SUPERADMIN.EVENTS}>
                <Calendar className="h-4 w-4" />
                គ្រប់គ្រងព្រឹត្តិការណ៍
              </a>
            </Button>
          ) : undefined
        }
      />

      {loading ? (
        <Grid cols={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </Grid>
      ) : types.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12" />}
          title="មិនមានប្រភេទព្រឹត្តិការណ៍"
          description="មិនមានព្រឹត្តិការណ៍ត្រូវបានបង្កើតនៅឡើយទេ"
        />
      ) : (
        <Grid cols={2}>
          {types.map(({ type, count }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className="group rounded-xl border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                    {type}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {count} ព្រឹត្តិការណ៍
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </button>
          ))}
        </Grid>
      )}
    </div>
  );
}
