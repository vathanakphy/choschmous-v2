'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';

interface StepProps {
    formData: any;
    setFields: (fields: any) => void;
    errors: any;
    onNext: (override?: any) => void;
}

interface SportEventItem {
    id: number;
    name: string;
    name_kh?: string;
}

function extractArray(json: any): any[] {
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.items)) return json.items;
    if (Array.isArray(json?.results)) return json.results;
    return [];
}

function mapSportEvent(raw: any): SportEventItem {
    return {
        id: raw.id,
        name: raw.name ?? raw.name_kh ?? '',
        name_kh: raw.name_kh,
    };
}

export function SportEventStep({ formData, setFields, errors, onNext }: StepProps) {
    const [sportEvents, setSportEvents] = useState<SportEventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        if (!formData.eventId) return;

        const controller = new AbortController();

        // Fetch sports-events filtered by event_id and enrich with sport names
        Promise.all([
            fetch(`/api/sports-events?skip=0&limit=100`, {
                signal: controller.signal,
            }).then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            }),
            fetch(`/api/sports?skip=0&limit=100`, {
                signal: controller.signal,
            }).then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            }),
        ])
            .then(([eventsData, sportsData]) => {
                const sportsEventsList = extractArray(eventsData);
                const sports = extractArray(sportsData);

                // Filter sports-events by event_id and map to sport event items
                const filteredSportsEvents = sportsEventsList.filter(
                    (se: any) => se.events_id === parseInt(formData.eventId, 10)
                );

                // Get unique sports from filtered sports-events
                const uniqueSportIds = new Set(filteredSportsEvents.map((se: any) => se.sports_id));
                const sportItems = sports
                    .filter((sport: any) => uniqueSportIds.has(sport.id))
                    .map((sport: any) => mapSportEvent(sport));

                setSportEvents(sportItems);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('[SportEventStep] fetch error:', err);
                    setFetchError('មិនអាចទាញទិន្នន័យបាន');
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [formData.eventId]);

    const handleSelect = (sportEvent: SportEventItem) => {
        const fields = {
            sportEventId: String(sportEvent.id),
            sportEventName: sportEvent.name,
            sportId: '',
            sportName: '',
            categoryId: '',
            categoryName: '',
        };
        setFields(fields);
        onNext(fields);
    };

    return (
        <div className="space-y-6">
            <StepHeader
                title="ជ្រើសរើសព្រឹត្តិការណ៍កីឡា"
                subtitle={`ព្រឹត្តិការណ៍កីឡាសម្រាប់ "${formData.eventName}"`}
            />

            {loading ? (
                <LoadingGrid />
            ) : fetchError ? (
                <p className="py-10 text-center" style={{ color: 'var(--destructive)' }}>
                    {fetchError}
                </p>
            ) : sportEvents.length === 0 ? (
                <p className="py-10 text-center" style={{ color: 'var(--reg-slate-600)' }}>
                    មិនមានព្រឹត្តិការណ៍កីឡា
                </p>
            ) : (
                <Grid cols={2}>
                    {sportEvents.map((sportEvent) => (
                        <SportEventCard
                            key={sportEvent.id}
                            sportEvent={sportEvent}
                            isSelected={formData.sportEventId === String(sportEvent.id)}
                            onSelect={handleSelect}
                        />
                    ))}
                </Grid>
            )}

            {errors.sportEventId && (
                <p className="text-xs" style={{ color: 'var(--destructive)' }}>
                    {errors.sportEventId}
                </p>
            )}
        </div>
    );
}

// ─── SportEventCard ────────────────────────────────────────────

interface SportEventCardProps {
    sportEvent: SportEventItem;
    isSelected: boolean;
    onSelect: (sportEvent: SportEventItem) => void;
}

function SportEventCard({ sportEvent, isSelected, onSelect }: SportEventCardProps) {
    const displayName = sportEvent.name ?? `Sport Event #${sportEvent.id}`;
    return (
        <button
            type="button"
            onClick={() => onSelect(sportEvent)}
            className={`event-card group ${isSelected ? 'selected' : ''}`}
        >
            {isSelected && (
                <div className="event-card-check">
                    <Check style={{ width: '0.875rem', height: '0.875rem', color: 'white' }} />
                </div>
            )}
            <h3 className={`event-card-title ${isSelected ? 'selected' : ''}`}>{displayName}</h3>
        </button>
    );
}

// ─── LoadingGrid ──────────────────────────────────────────────

function LoadingGrid() {
    return (
        <Grid cols={2}>
            {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
        </Grid>
    );
}
