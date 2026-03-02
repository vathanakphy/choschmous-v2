'use client';

import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Badge } from '@/ui/design-system/primitives/Badge';
import { Button } from '@/ui/design-system/primitives/Button';
import type { DashboardEvent } from '../types/Dashboard.types';

type EventsPanelProps = {
  events: DashboardEvent[];
  isLoading: boolean;
  eventsRoute: string;
  eventRoute: (id: string) => string;
};

function formatDate(iso: string) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function EventsPanel({ events, isLoading, eventsRoute, eventRoute }: EventsPanelProps) {
  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <CalendarDays className="text-primary h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold">ព្រឹត្តិការណ៍ថ្មីៗ</h2>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={eventsRoute}>
            មើលទាំងអស់ <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {!isLoading && events.length === 0 && (
          <p className="bg-muted text-muted-foreground rounded-xl px-4 py-8 text-center text-sm">
            មិនមានកំណត់ត្រាព្រឹត្តិការណ៍ទេ។
          </p>
        )}

        {events.map((event) => (
          <Link
            key={event.id}
            href={eventRoute(String(event.id))}
            className="group bg-background hover:bg-muted/40 flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate font-medium">{event.name}</p>
              <div className="mt-1 flex items-center gap-2">
                {event.type && (
                  <Badge variant="secondary" className="text-[10px]">
                    {event.type}
                  </Badge>
                )}
                <span className="text-muted-foreground text-xs">{formatDate(event.createdAt)}</span>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
