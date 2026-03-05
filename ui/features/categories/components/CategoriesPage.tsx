'use client';

import { Suspense, useState, useEffect } from 'react';
import { CategoriesWizard } from './CategoriesWizard';
interface EventsDrillDownPageProps {
  role: 'admin' | 'superadmin';
}
function CategoriesContent({ role }: EventsDrillDownPageProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events', { signal: controller.signal });
        const payload = await response.json();
        if (payload?.data && Array.isArray(payload.data)) {
          setEvents(payload.data);
        } else {
          setEvents([]);
        }
      } catch {
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
    return () => controller.abort();
  }, []);

  return (
    <div className="px-8 py-10">
      <CategoriesWizard role={role} events={events} eventsLoading={eventsLoading} />
    </div>
  );
}

export function CategoriesPage({ role }: EventsDrillDownPageProps) {
  return (
    <Suspense fallback={<div className="px-8 py-10">Loading...</div>}>
      <CategoriesContent role={role} />
    </Suspense>
  );
}
