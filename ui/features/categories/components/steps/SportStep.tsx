'use client';

import { useEffect, useState, useMemo } from 'react';
import { Check } from 'lucide-react';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';

interface StepProps {
    formData: any;
    setFields: (fields: any) => void;
    errors: any;
    onNext: (override?: any) => void;
}

interface SportItem {
    id: number;
    name: string;
    name_kh?: string;
}

interface SportsEvent {
    id: number;
    events_id: number;
    sports_id: number;
    created_at: string;
}

function extractArray(json: any): any[] {
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.items)) return json.items;
    if (Array.isArray(json?.results)) return json.results;
    return [];
}

export function SportStep({ formData, setFields, errors, onNext }: StepProps) {
    const [sports, setSports] = useState<SportItem[]>([]);
    const [sportsEvents, setSportsEvents] = useState<SportsEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Clear sport selection when entering this step
    useEffect(() => {
        setFields({
            sportId: '',
            sportName: '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.eventId]);

    // Fetch sports-events and sports list
    useEffect(() => {
        if (!formData.eventId) return;

        const controller = new AbortController();
        setLoading(true);
        setFetchError(null);
        setSports([]); // Clear old sports data
        setSportsEvents([]); // Clear old sports-events data

        Promise.all([
            fetch(`/api/sports-events?skip=0&limit=100`, { signal: controller.signal }).then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            }),
            fetch(`/api/sports?skip=0&limit=100`, { signal: controller.signal }).then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            }),
        ])
            .then(([eventsData, sportsData]) => {
                const eventsList = extractArray(eventsData);
                const sportsList = extractArray(sportsData);

                setSportsEvents(eventsList);
                setSports(sportsList);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('[SportStep] fetch error:', err);
                    setFetchError('មិនអាចទាញទិន្នន័យបាន');
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [formData.eventId]);

    // Filter sports by relationships: find sports linked to the selected event
    const filteredSports = useMemo(() => {
        if (!formData.eventId) return [];
        const eventIdNum = parseInt(formData.eventId, 10);

        // Find all sports_id that are linked to this event from sports-events
        const sportIds = new Set(
            sportsEvents.filter((se) => se.events_id === eventIdNum).map((se) => se.sports_id)
        );

        // Filter sports list to only include those linked
        return sports.filter((sport) => sportIds.has(sport.id));
    }, [sports, sportsEvents, formData.eventId]);

    const handleSelect = (sport: SportItem) => {
        const fields = {
            sportId: String(sport.id),
            sportName: sport.name_kh ?? sport.name ?? '',
            // Clear downstream data when sport changes
            categoryId: '',
            categoryName: '',
        };
        setFields(fields);
        onNext(fields);
    };

    return (
        <div className="space-y-6">
            <StepHeader
                title="ជ្រើសរើសកីឡា"
                subtitle={`ជ្រើសរើសកីឡាសម្រាប់ "${formData.eventName}"`}
            />

            {loading ? (
                <LoadingGrid />
            ) : fetchError ? (
                <p className="py-10 text-center" style={{ color: 'var(--destructive)' }}>
                    {fetchError}
                </p>
            ) : filteredSports.length === 0 ? (
                <p className="py-10 text-center" style={{ color: 'var(--reg-slate-600)' }}>
                    មិនមានកីឡា
                </p>
            ) : (
                <Grid cols={2}>
                    {filteredSports.map((sport) => (
                        <SportCard
                            key={sport.id}
                            sport={sport}
                            isSelected={formData.sportId === String(sport.id)}
                            onSelect={handleSelect}
                        />
                    ))}
                </Grid>
            )}

            {errors.sportId && (
                <p className="text-xs" style={{ color: 'var(--destructive)' }}>
                    {errors.sportId}
                </p>
            )}
        </div>
    );
}

interface SportCardProps {
    sport: SportItem;
    isSelected: boolean;
    onSelect: (sport: SportItem) => void;
}

function SportCard({ sport, isSelected, onSelect }: SportCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(sport)}
            className={`event-card group ${isSelected ? 'selected' : ''}`}
        >
            {isSelected && (
                <div className="event-card-check">
                    <Check style={{ width: '0.875rem', height: '0.875rem', color: 'white' }} />
                </div>
            )}
            <h3 className={`event-card-title ${isSelected ? 'selected' : ''}`}>
                {sport.name_kh ?? sport.name}
            </h3>
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
