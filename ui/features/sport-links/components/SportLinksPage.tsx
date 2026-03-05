'use client';

import { useState } from 'react';
import { Plus, Link2, Pencil, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
import { useFetchList } from '@/ui/hooks/useFetchList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { PaginationBar } from '@/ui/components/navigation/PaginationBar';
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
import type { SportOrgLinkEnriched } from '@/domains/sport-org-links';

type NamedItem = { id: number; name: string | undefined };

export function SportLinksPage() {
    const list = usePagedList<SportOrgLinkEnriched>(ROUTES.API.SPORT_ORG_LINKS);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<SportOrgLinkEnriched | null>(null);
    const [editing, setEditing] = useState<SportOrgLinkEnriched | null>(null);
    const [form, setForm] = useState({ events_id: '', sports_id: '', organization_id: '' });
    const [saving, setSaving] = useState(false);

    // Fetch lookup data
    const mapName = (r: any): NamedItem => ({ id: r.id, name: r.name ?? r.name_kh });
    const events = useFetchList<NamedItem>(`${ROUTES.API.EVENTS}?limit=100`, mapName);
    const sports = useFetchList<NamedItem>(`${ROUTES.API.SPORTS}?limit=100`, mapName);
    const organizations = useFetchList<NamedItem>(`${ROUTES.API.ORGANIZATIONS}?limit=100`, mapName);

    const openCreate = () => {
        setEditing(null);
        setForm({ events_id: '', sports_id: '', organization_id: '' });
        setDialogOpen(true);
    };

    const openEdit = (link: SportOrgLinkEnriched) => {
        setEditing(link);
        setForm({
            events_id: String(link.events_id),
            sports_id: String(link.sports_id),
            organization_id: String(link.organization_id),
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.events_id || !form.sports_id || !form.organization_id) return;
        setSaving(true);
        try {
            const data = {
                events_id: parseInt(form.events_id, 10),
                sports_id: parseInt(form.sports_id, 10),
                organization_id: parseInt(form.organization_id, 10),
            };
            if (editing) {
                await apiClient.patch(`${ROUTES.API.SPORT_ORG_LINKS}/${editing.id}`, data);
            } else {
                await apiClient.post(ROUTES.API.SPORT_ORG_LINKS, data);
            }
            setDialogOpen(false);
            list.reload();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await apiClient.delete(`${ROUTES.API.SPORT_ORG_LINKS}/${deleteTarget.id}`);
        setDeleteTarget(null);
        list.reload();
    };

    const fmtDate = (d: string) =>
        d
            ? new Date(d).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' })
            : '—';

    return (
        <div className="space-y-6">
            <PageHeader
                title="បញ្ចីប្រភេទកីឡា"
                subtitle="គ្រប់គ្រងបញ្ចីលម្អិតលម្អិតស្ថាប័ន-ព្រឹត្តិការណ៍-កីឡា"
                action={
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        បន្ថែមលម្អិត
                    </Button>
                }
            />

            {list.error && (
                <div className="border-destructive/40 bg-destructive/10 rounded-xl border px-5 py-4">
                    <p className="text-destructive text-sm">{list.error}</p>
                </div>
            )}

            {list.isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
            ) : list.data.length === 0 ? (
                <EmptyState
                    icon={<Link2 className="h-12 w-12" />}
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
                                <TableHead>ស្ថាប័ន</TableHead>
                                <TableHead>កាលបរិច្ឆេទ</TableHead>
                                <TableHead className="text-right">សកម្មភាព</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.map((link, idx) => (
                                <TableRow key={link.id}>
                                    <TableCell className="text-muted-foreground">
                                        {(list.page - 1) * list.pageSize + idx + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{link.sportName || `#${link.sports_id}`}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{link.eventName || `#${link.events_id}`}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {link.organizationName || `#${link.organization_id}`}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {fmtDate(link.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(link)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(link)}>
                                                <Trash2 className="text-destructive h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="px-4 pb-4">
                        <PaginationBar
                            page={list.page}
                            totalPages={list.totalPages}
                            total={list.total}
                            pageSize={list.pageSize}
                            onPageChange={list.setPage}
                        />
                    </div>
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
                        
                        <div className="space-y-2">
                            <Label>ស្ថាប័ន</Label>
                            <Select value={form.organization_id} onValueChange={(v) => setForm((f) => ({ ...f, organization_id: v }))}>
                                <SelectTriggerInput className="w-full">
                                    <SelectValue placeholder="ជ្រើសរើសស្ថាប័ន" />
                                </SelectTriggerInput>
                                <SelectContent>
                                    {organizations.data.map((o) => (
                                        <SelectItem key={o.id} value={String(o.id)}>
                                            {o.name}
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
                            disabled={saving || !form.events_id || !form.sports_id || !form.organization_id}
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
