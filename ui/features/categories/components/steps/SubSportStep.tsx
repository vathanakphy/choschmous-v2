'use client';

import { useEffect, useState, useMemo } from 'react';
import { Check, Plus, Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';
import { Button } from '@/ui/design-system/primitives/Button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/ui/design-system/primitives/dialog';
import { Input } from '@/ui/design-system/primitives/Input';
import { Label } from '@/ui/design-system/primitives/label';
import { apiClient } from '@/lib/api/client';

interface StepProps {
    formData: any;
    setFields: (fields: any) => void;
    errors: any;
    onNext?: (override?: any) => void;
}

interface SubSportItem {
    id: number;
    name: string; // Maps from API 'category' field
    sports_id: number; // Keep track of which sport this belongs to
}

function mapSubSportResponse(raw: any): SubSportItem {
    return {
        id: raw.id,
        name: raw.category ?? '', // Map 'category' field to 'name'
        sports_id: raw.sports_id ?? 0,
    };
}

function extractSubSports(json: any): SubSportItem[] {
    if (!Array.isArray(json?.data)) return [];
    return json.data.map(mapSubSportResponse);
}

export function SubSportStep({ formData, setFields, errors, onNext }: StepProps) {
    const [subSports, setSubSports] = useState<SubSportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<SubSportItem | null>(null);
    const [subSportName, setSubSportName] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<SubSportItem | null>(null);

    useEffect(() => {
        if (!formData.eventId || !formData.sportId) return;

        const controller = new AbortController();
        // Reset state when starting new fetch
        setLoading(true);
        setFetchError(null);
        setSubSports([]); // Clear old data immediately

        fetch(
            `/api/org-sports/categories?events_id=${formData.eventId}&sports_id=${formData.sportId}&skip=0&limit=100`,
            { signal: controller.signal }
        )
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((json) => {
                const data = extractSubSports(json);
                setSubSports(data);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('[SubSportStep] fetch error:', err);
                    setFetchError('មិនអាចទាញទិន្នន័យបាន');
                }
            })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, [formData.eventId, formData.sportId]);

    // Filter to ensure we only show categories for the selected sport
    const filteredSubSports = useMemo(() => {
        if (!formData.sportId) return [];
        const sportIdNum = parseInt(formData.sportId, 10);
        return subSports.filter((item) => item.sports_id === sportIdNum);
    }, [subSports, formData.sportId]);

    const handleSelectSubSport = (subSport: SubSportItem) => {
        const fields = {
            categoryId: String(subSport.id),
            categoryName: subSport.name,
        };
        setFields(fields);
        if (onNext) onNext(fields);
    };

    const openCreate = () => {
        setEditing(null);
        setSubSportName('');
        setDialogOpen(true);
    };

    const openEdit = (subSport: SubSportItem) => {
        setEditing(subSport);
        setSubSportName(subSport.name); // Uses mapped 'name' field
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!subSportName.trim()) return;
        setSaving(true);
        try {
            const body = {
                category: subSportName,
                sports_id: Number(formData.sportId),
                events_id: Number(formData.eventId),
            };
            if (editing) {
                await apiClient.patch(`/api/org-sports/categories/${editing.id}`, body);
            } else {
                await apiClient.post('/api/org-sports/categories', body);
            }
            setDialogOpen(false);
            const response = await fetch(
                `/api/org-sports/categories?events_id=${formData.eventId}&sports_id=${formData.sportId}&skip=0&limit=100`
            );
            if (response.ok) {
                const json = await response.json();
                const data = extractSubSports(json);
                setSubSports(data);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await apiClient.delete(`/api/org-sports/categories/${deleteTarget.id}`);
            setDeleteTarget(null);
            const response = await fetch(
                `/api/org-sports/categories?events_id=${formData.eventId}&sports_id=${formData.sportId}&skip=0&limit=100`
            );
            if (response.ok) {
                const json = await response.json();
                const data = extractSubSports(json);
                setSubSports(data);
            }
        } catch (err) {
            console.error('Error deleting sub sport:', err);
        }
    };

    return (
        <div className="space-y-6">
            <StepHeader
                title="ជ្រើសរើស ឬបង្កើតវិញ្ញាសារ"
                subtitle={`វិញ្ញាសារសម្រាប់ ${formData.sportName || `កីឡា #${formData.sportId}`}`}
            />
            {loading ? (
                <LoadingGrid />
            ) : fetchError ? (
                <p className="py-10 text-center" style={{ color: 'var(--destructive)' }}>
                    {fetchError}
                </p>
            ) : filteredSubSports.length === 0 ? (
                <div className="space-y-4">
                    <p className="py-10 text-center" style={{ color: 'var(--reg-slate-600)' }}>
                        មិនមានវិញ្ញាសារ
                    </p>
                    <div className="flex justify-center">
                        <Button onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            បន្ថែមវិញ្ញាសារ
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <Grid cols={2}>
                        {filteredSubSports.map((subSport) => (
                            <div
                                key={subSport.id}
                                className={`event-card group ${formData.categoryId === String(subSport.id) ? 'selected' : ''}`}
                            >
                                {formData.categoryId === String(subSport.id) && (
                                    <div className="event-card-check">
                                        <Check style={{ width: '0.875rem', height: '0.875rem', color: 'white' }} />
                                    </div>
                                )}
                                <div className="flex items-start justify-between">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectSubSport(subSport)}
                                        className="flex-1 text-left"
                                    >
                                        <h3
                                            className={`event-card-title ${formData.categoryId === String(subSport.id) ? 'selected' : ''
                                                }`}
                                        >
                                            {subSport.name}
                                        </h3>
                                    </button>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(subSport)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(subSport)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Grid>
                    <div className="flex justify-center pt-4">
                        <Button onClick={openCreate} variant="outline">
                            <Plus className="h-4 w-4" />
                            បន្ថែមវិញ្ញាសារ
                        </Button>
                    </div>
                </div>
            )}
            {errors.categoryId && (
                <p className="text-xs" style={{ color: 'var(--destructive)' }}>
                    {errors.categoryId}
                </p>
            )}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'កែសម្រួលវិញ្ញាសារ' : 'បន្ថែមវិញ្ញាសារ'}</DialogTitle>
                        <DialogDescription>
                            {editing ? 'កែសម្រួលឈ្មោះវិញ្ញាសារ' : 'បគ្នូលឈ្មោះវិញ្ញាសារថ្មី'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>ឈ្មោះវិញ្ញាសារ</Label>
                            <Input
                                value={subSportName}
                                onChange={(e) => setSubSportName(e.target.value)}
                                placeholder="ឧ. បុរស U18, នារី Open"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>ប្រភេទព្រឹត្តិការណ៍: {formData.eventType || '(មិនបានជ្រើស)'}</p>
                            <p>ព្រឹត្តិការណ៍: {formData.eventName || `ID #${formData.eventId}`}</p>
                            <p>កីឡា: {formData.sportName || `ID #${formData.sportId}`}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                            បោះបង់
                        </Button>
                        <Button onClick={handleSave} disabled={saving || !subSportName.trim()}>
                            {saving ? 'កំពុងរក្សាទុក...' : editing ? 'រក្សាទុក' : 'បង្កើត'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>លុបវិញ្ញាសារ</DialogTitle>
                        <DialogDescription>
                            តើអ្នកពិតជាចង់លុប &ldquo;{deleteTarget?.name}&rdquo; មែនទេ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            បោះបង់
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            លុប
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function LoadingGrid() {
    return (
        <Grid cols={2}>
            {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
        </Grid>
    );
}
