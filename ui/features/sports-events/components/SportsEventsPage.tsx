'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Zap, Pencil, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useFetchList } from '@/ui/hooks/useFetchList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
import { Badge } from '@/ui/design-system/primitives/Badge';
import { Button } from '@/ui/design-system/primitives/Button';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/ui/design-system/primitives/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/ui/design-system/primitives/dialog';
import { Label } from '@/ui/design-system/primitives/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTriggerInput,
    SelectValue,
} from '@/ui/design-system/primitives/select';
import { apiClient } from '@/lib/api/client';

type NamedItem = { id: number; name: string | undefined };
type SportsEvent = { id: number; events_id: number; sports_id: number; created_at: string; eventName?: string; sportName?: string };

export function SportsEventsPage() {
    // Sports Events data
    const [data, setData] = useState<SportsEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<SportsEvent | null>(null);
    const [editing, setEditing] = useState<SportsEvent | null>(null);
    const [form, setForm] = useState({ events_id: '', sports_id: '' });
    const [saving, setSaving] = useState(false);

    // Fetch sports events list
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${ROUTES.API.SPORTS_EVENTS}`);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
                setData(json.data);
            } else {
                setError('រចនាសម្ព័ន្ធទិន្នន័យមិនត្រឹមត្រូវ');
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'មិនអាចទាញទិន្នន័យបាន');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    // Fetch lookup data
    const mapName = (r: any): NamedItem => ({ id: r.id, name: r.name ?? r.name_kh });
    // Request larger pages so dropdowns show the full list (API default limit is 20)
    const events = useFetchList<NamedItem>(`${ROUTES.API.EVENTS}?limit=100`, mapName);
    const sports = useFetchList<NamedItem>(`${ROUTES.API.SPORTS}?limit=100`, mapName);

    // Enrich data with event and sport names
    const enrichedData = useMemo(
        () =>
            data.map((item) => ({
                ...item,
                eventName: events.data.find((e) => e.id === item.events_id)?.name,
                sportName: sports.data.find((s) => s.id === item.sports_id)?.name,
            })),
        [data, events.data, sports.data]
    );

    const openCreate = () => {
        setEditing(null);
        setForm({ events_id: '', sports_id: '' });
        setDialogOpen(true);
    };

    const openEdit = (item: SportsEvent) => {
        setEditing(item);
        setForm({
            events_id: String(item.events_id),
            sports_id: String(item.sports_id),
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.events_id || !form.sports_id) return;
        setSaving(true);
        try {
            const saveData = {
                events_id: parseInt(form.events_id, 10),
                sports_id: parseInt(form.sports_id, 10),
            };
            if (editing) {
                await apiClient.patch(`${ROUTES.API.SPORTS_EVENTS}/${editing.id}`, saveData);
            } else {
                await apiClient.post(ROUTES.API.SPORTS_EVENTS, saveData);
            }
            setDialogOpen(false);
            await fetchData();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await apiClient.delete(`${ROUTES.API.SPORTS_EVENTS}/${deleteTarget.id}`);
        setDeleteTarget(null);
        await fetchData();
    };

    const fmtDate = (d: string) =>
        d
            ? new Date(d).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' })
            : '—';

    return (
        <div className="space-y-6">
            <PageHeader
                title="កីឡាព្រឹត្តិការណ៍"
                subtitle="គ្រប់គ្រងលម្អិតលម្អិតកីឡា-ព្រឹត្តិការណ៍"
                action={
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        បន្ថែមលម្អិត
                    </Button>
                }
            />

            {error && (
                <div className="border-destructive/40 bg-destructive/10 rounded-xl border px-5 py-4">
                    <p className="text-destructive text-sm">{error}</p>
                </div>
            )}

            {isLoading || events.loading || sports.loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
            ) : data.length === 0 ? (
                <EmptyState
                    icon={<Zap className="h-12 w-12" />}
                    title="មិនមានលម្អិត"
                    description="ចាប់ផ្តើមបន្ថែមលម្អិតថ្មី"
                    action={
                        <Button onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            បន្ថែមលម្អិត
                        </Button>
                    }
                />
            ) : (
                <div className="bg-card rounded-2xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>កីឡា</TableHead>
                                <TableHead>ព្រឹត្តិការណ៍</TableHead>
                                <TableHead>កាលបរិច្ឆេទ</TableHead>
                                <TableHead className="text-right">សកម្មភាព</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrichedData.map((item, idx) => (
                                <TableRow key={item.id}>
                                    <TableCell className="text-muted-foreground">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{item.sportName || `#${item.sports_id}`}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.eventName || `#${item.events_id}`}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {fmtDate(item.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(item)}>
                                                <Trash2 className="text-destructive h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Create / Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setEditing(null); setDialogOpen(open); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'កែសម្រួលលម្អិត' : 'បន្ថែមលម្អិត'}</DialogTitle>
                        <DialogDescription>
                            {editing ? 'កែសម្រួលព័ត៌មានលម្អិតដែលមានស្រាប់' : 'បំពេញព័ត៌មានដើម្បីបង្កើតលម្អិតថ្មី'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>ព្រឹត្តិការណ៍</Label>
                            <Select value={form.events_id} onValueChange={(v) => setForm((f) => ({ ...f, events_id: v }))}>
                                <SelectTriggerInput className="w-full">
                                    <SelectValue placeholder="ជ្រើសរើសព្រឹត្តិការណ៍" />
                                </SelectTriggerInput>
                                <SelectContent>
                                    {events.data.map((e) => (
                                        <SelectItem key={e.id} value={String(e.id)}>
                                            {e.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>កីឡា</Label>
                            <Select value={form.sports_id} onValueChange={(v) => setForm((f) => ({ ...f, sports_id: v }))}>
                                <SelectTriggerInput className="w-full">
                                    <SelectValue placeholder="ជ្រើសរើសកីឡា" />
                                </SelectTriggerInput>
                                <SelectContent>
                                    {sports.data.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setDialogOpen(false); setEditing(null); }} disabled={saving}>
                            បោះបង់
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !form.events_id || !form.sports_id}
                        >
                            {saving ? 'កំពុងរក្សាទុក...' : editing ? 'រក្សាទុក' : 'បង្កើត'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>លុបលម្អិត</DialogTitle>
                        <DialogDescription>
                            តើអ្នកពិតជាចង់លុបលម្អិតនេះមែនទេ?
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
