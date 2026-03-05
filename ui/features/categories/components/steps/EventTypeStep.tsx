'use client';

import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';

interface StepProps {
    formData: any;
    setFields: (fields: any) => void;
    errors: any;
    onNext: (override?: any) => void;
    events: any[];
    loading?: boolean;
}

interface EventType {
    name: string;
    count: number;
}

export function EventTypeStep({ events, loading, formData, setFields, errors, onNext }: StepProps) {
    // Extract unique event types from all events
    const eventTypes = useMemo(() => {
        if (!events.length) return [];
        const typesMap = new Map<string, number>();
        events.forEach((event) => {
            const type = event.type || 'ដូចខាងក្រោម';
            typesMap.set(type, (typesMap.get(type) || 0) + 1);
        });
        return Array.from(typesMap).map(([name, count]) => ({ name, count }));
    }, [events]);

    const handleSelectType = (typeName: string) => {
        const fields = {
            eventType: typeName,
            eventId: '',
            eventName: '',
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
                        <EventTypeCard
                            key={type.name}
                            typeName={type.name}
                            count={type.count}
                            isSelected={formData.eventType === type.name}
                            onSelect={handleSelectType}
                        />
                    ))}
                </Grid>
            )}

            {errors.eventType && (
                <p className="text-xs" style={{ color: 'var(--destructive)' }}>
                    {errors.eventType}
                </p>
            )}
        </div>
    );
}

interface EventTypeCardProps {
    typeName: string;
    count: number;
    isSelected: boolean;
    onSelect: (typeName: string) => void;
}

function EventTypeCard({ typeName, count, isSelected, onSelect }: EventTypeCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(typeName)}
            className={`event-card group ${isSelected ? 'selected' : ''}`}
        >
            {isSelected && (
                <div className="event-card-check">
                    <Check style={{ width: '0.875rem', height: '0.875rem', color: 'white' }} />
                </div>
            )}
            <div className="flex flex-col gap-1">
                <h3 className={`event-card-title ${isSelected ? 'selected' : ''}`}>{typeName}</h3>
                <p className="text-xs opacity-75">{count} ព្រឹត្តិការណ៍</p>
            </div>
        </button>
    );
}

function LoadingGrid() {
    const { Skeleton } = require('@/ui/design-system/primitives/Skeleton');
    return (
        <Grid cols={2}>
            {[1, 2, 3, 4].map((i: number) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
        </Grid>
    );
}
