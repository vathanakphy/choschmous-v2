'use client';

import { useState } from 'react';
import { Check, ChevronLeft } from 'lucide-react';
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

export function EventTypeAndEventStep({ events, loading, formData, setFields, errors, onNext }: StepProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Derive unique event types from events
    const eventTypes = Array.from(
        new Set(
            events
                .filter((e) => !!e && e.id != null)
                .map((e) => (e as any).type)
                .filter(Boolean)
        )
    ) as string[];

    // Events filtered by selected type
    const filteredEvents = selectedType ? events.filter((e) => (e as any).type === selectedType) : [];

    const handleSelectType = (type: string) => {
        setSelectedType(type);
        // Clear previously selected event if type changes
        setFields({ eventTypeId: type, eventTypeName: type, eventId: '', eventName: '' });
    };

    const handleSelectEvent = (event: any) => {
        const fields = {
            eventId: String(event.id),
            eventName: event.name ?? event.name_kh ?? '',
        };
        setFields(fields);
        onNext(fields);
    };

    return (
        <div className="space-y-6">
            {!selectedType ? (
                // ── Phase 1: Pick event type ──
                <>
                    <StepHeader
                        title="ជ្រើសរើសប្រភេទព្រឹត្តិការណ៍"
                        subtitle="ជ្រើសរើសប្រភេទព្រឹត្តិការណ៍ដែលអ្នកចង់គ្រប់គ្រង"
                    />

                    {loading ? (
                        <LoadingGrid />
                    ) : eventTypes.length === 0 ? (
                        <p className="py-10 text-center" style={{ color: 'var(--reg-slate-600)' }}>
                            មិនមានប្រភេទព្រឹត្តិការណ៍
                        </p>
                    ) : (
                        <Grid cols={2}>
                            {eventTypes.map((type) => (
                                <TypeCard
                                    key={type}
                                    type={type}
                                    count={events.filter((e) => (e as any).type === type).length}
                                    onSelect={handleSelectType}
                                />
                            ))}
                        </Grid>
                    )}
                </>
            ) : (
                // ── Phase 2: Pick specific event ──
                <>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedType(null);
                                setFields({ eventTypeId: '', eventTypeName: '' });
                            }}
                            className="flex items-center gap-1 text-sm"
                            style={{ color: 'var(--reg-indigo-600)' }}
                        >
                            <ChevronLeft style={{ width: '1rem', height: '1rem' }} />
                            ត្រលប់
                        </button>
                        <span style={{ color: 'var(--reg-slate-300)' }}>|</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--reg-slate-700)' }}>
                            {selectedType}
                        </span>
                    </div>

                    <StepHeader
                        title="ជ្រើសរើសព្រឹត្តិការណ៍"
                        subtitle="ជ្រើសរើសព្រឹត្តិការណ៍ដែលអ្នកចង់គ្រប់គ្រង"
                    />

                    {filteredEvents.length === 0 ? (
                        <p className="py-10 text-center" style={{ color: 'var(--reg-slate-600)' }}>
                            មិនមានព្រឹត្តិការណ៍ក្នុងប្រភេទនេះ
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
                </>
            )}

            {errors.eventTypeId && (
                <p className="text-xs" style={{ color: 'var(--destructive)' }}>
                    {errors.eventTypeId}
                </p>
            )}
        </div>
    );
}

// ─── TypeCard ─────────────────────────────────────────────────

interface TypeCardProps {
    type: string;
    count: number;
    onSelect: (type: string) => void;
}

function TypeCard({ type, count, onSelect }: TypeCardProps) {
    return (
        <button type="button" onClick={() => onSelect(type)} className="event-card group text-left">
            <h3 className="event-card-title">{type}</h3>
            <p className="event-card-text mt-2 text-sm">{count} ព្រឹត្តិការណ៍</p>
        </button>
    );
}

// ─── EventCard ────────────────────────────────────────────────

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
