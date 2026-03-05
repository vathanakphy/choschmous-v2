'use client';

import { useMemo } from 'react';
import { Check } from 'lucide-react';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';

interface StepProps {
    formData: any;
    setFields: (fields: any) => void;
    errors: any;
    onNext: (override?: any) => void;
    events: any[];
    loading?: boolean;
}

export function EventStep({ events, loading, formData, setFields, errors, onNext }: StepProps) {
    // Filter events by selected eventType
    const filteredEvents = useMemo(() => {
        if (!formData.eventType || !events.length) return [];
        return events.filter((event) => (event.type || 'ដូចខាងក្រោម') === formData.eventType);
    }, [events, formData.eventType]);

    const handleSelectEvent = (event: any) => {
        const fields = {
            eventId: String(event.id),
            eventName: event.name ?? event.name_kh ?? '',
            // Clear downstream data when event changes
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
                title="ជ្រើសរើសព្រឹត្តិការណ៍"
                subtitle={`ជ្រើសរើសព្រឹត្តិការណ៍សម្រាប់ប្រភេទ "${formData.eventType}"`}
            />

            {loading ? (
                <LoadingGrid />
            ) : filteredEvents.length === 0 ? (
                <p className="py-10 text-center" style={{ color: 'var(--reg-slate-600)' }}>
                    មិនមានព្រឹត្តិការណ៍
                </p>
            ) : (
                <Grid cols={2}>
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            isSelected={formData.eventId === String(event.id)}
                            onSelect={handleSelectEvent}
                        />
                    ))}
                </Grid>
            )}

            {errors.eventId && (
                <p className="text-xs" style={{ color: 'var(--destructive)' }}>
                    {errors.eventId}
                </p>
            )}
        </div>
    );
}

interface EventCardProps {
    event: any;
    isSelected: boolean;
    onSelect: (event: any) => void;
}

function EventCard({ event, isSelected, onSelect }: EventCardProps) {
    const displayName = event.name ?? event.name_kh ?? `Event #${event.id}`;
    return (
        <button
            type="button"
            onClick={() => onSelect(event)}
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
