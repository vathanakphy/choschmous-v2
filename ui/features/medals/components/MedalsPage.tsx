'use client';

import { useState, useCallback } from 'react';
import { Plus, Medal, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { PaginationBar } from '@/ui/components/navigation/PaginationBar';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
import { Button } from '@/ui/design-system/primitives/Button';
import { Badge } from '@/ui/design-system/primitives/Badge';
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
import { useFetchList } from '@/ui/hooks/useFetchList';

type APItem = {
  id: number;
  athletesId: number | null;
  eventsId: number | null;
  sportsId: number | null;
  categoryId: number | null;
  organizationId: number | null;
  createdAt: string;
};

type NamedItem = { id: number; name: string };

export function MedalsPage() {
  const list = usePagedList<APItem>(ROUTES.API.ATHLETE_PARTICIPATIONS, { pageSize: 50 });

  // Lookup data
  const mapNamed = (r: any): NamedItem => ({ id: r.id, name: r.name ?? r.name_kh ?? '' });
  const athletes = useFetchList<NamedItem>(`${ROUTES.API.ATHLETES}?limit=500`, mapNamed);
  const events = useFetchList<NamedItem>(`${ROUTES.API.EVENTS}?limit=500`, mapNamed);
  const sports = useFetchList<NamedItem>(`${ROUTES.API.SPORTS}?limit=500`, mapNamed);
  const categories = useFetchList<NamedItem>(`${ROUTES.API.CATEGORIES}?limit=500`, mapNamed);
  const organizations = useFetchList<NamedItem>(`${ROUTES.API.ORGANIZATIONS}?limit=500`, mapNamed);

  const nameMap = useCallback((items: NamedItem[], id: number | null) => {
    if (id == null) return '—';
    const found = items.find((i) => i.id === id);
    return found?.name ?? `#${id}`;
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<APItem | null>(null);
  const [form, setForm] = useState({
    athletesId: '',
    eventsId: '',
    sportsId: '',
    categoryId: '',
    organizationId: '',
  });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setForm({ athletesId: '', eventsId: '', sportsId: '', categoryId: '', organizationId: '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.post(ROUTES.API.ATHLETE_PARTICIPATIONS, {
        athletes_id: Number(form.athletesId),
        events_id: Number(form.eventsId),
        sports_id: Number(form.sportsId),
        category_id: form.categoryId ? Number(form.categoryId) : null,
        organization_id: Number(form.organizationId),
      });
      setDialogOpen(false);
      list.reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await apiClient.delete(`${ROUTES.API.ATHLETE_PARTICIPATIONS}/${deleteTarget.id}`);
    setDeleteTarget(null);
    list.reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="មេដាយ / ការចូលរួមកីឡាករ"
        subtitle="គ្រប់គ្រងការចូលរួមកីឡាករក្នុងព្រឹត្តិការណ៍កីឡា"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            បន្ថែមការចូលរួម
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
          icon={<Medal className="h-12 w-12" />}
          title="មិនមានទិន្នន័យ"
          description="ចាប់ផ្តើមបន្ថែមការចូលរួមកីឡាករថ្មី"
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              បន្ថែមការចូលរួម
            </Button>
          }
        />
      ) : (
        <>
          <div className="bg-card rounded-2xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>កីឡាករ</TableHead>
                  <TableHead>ព្រឹត្តិការណ៍</TableHead>
                  <TableHead>កីឡា</TableHead>
                  <TableHead>ប្រភេទ</TableHead>
                  <TableHead>ស្ថាប័ន</TableHead>
                  <TableHead className="text-right">សកម្មភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.map((ap, idx) => (
                  <TableRow key={ap.id}>
                    <TableCell className="text-muted-foreground">
                      {(list.page - 1) * 50 + idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {nameMap(athletes.data, ap.athletesId)}
                    </TableCell>
                    <TableCell>{nameMap(events.data, ap.eventsId)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{nameMap(sports.data, ap.sportsId)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {nameMap(categories.data, ap.categoryId)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {nameMap(organizations.data, ap.organizationId)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(ap)}>
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationBar
            page={list.page}
            totalPages={list.totalPages}
            total={list.total}
            pageSize={50}
            onPageChange={list.setPage}
          />
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>បន្ថែមការចូលរួមកីឡាករ</DialogTitle>
            <DialogDescription>ជ្រើសរើសកីឡាករ ព្រឹត្តិការណ៍ កីឡា និងស្ថាប័ន</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>កីឡាករ</Label>
              <Select
                value={form.athletesId}
                onValueChange={(v) => setForm((f) => ({ ...f, athletesId: v }))}
              >
                <SelectTriggerInput>
                  <SelectValue placeholder="ជ្រើសរើសកីឡាករ" />
                </SelectTriggerInput>
                <SelectContent>
                  {athletes.data.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ព្រឹត្តិការណ៍</Label>
              <Select
                value={form.eventsId}
                onValueChange={(v) => setForm((f) => ({ ...f, eventsId: v }))}
              >
                <SelectTriggerInput>
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
              <Select
                value={form.sportsId}
                onValueChange={(v) => setForm((f) => ({ ...f, sportsId: v }))}
              >
                <SelectTriggerInput>
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
              <Label>ប្រភេទ (ជម្រើស)</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
              >
                <SelectTriggerInput>
                  <SelectValue placeholder="ជ្រើសរើសប្រភេទ" />
                </SelectTriggerInput>
                <SelectContent>
                  {categories.data.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ស្ថាប័ន</Label>
              <Select
                value={form.organizationId}
                onValueChange={(v) => setForm((f) => ({ ...f, organizationId: v }))}
              >
                <SelectTriggerInput>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              បោះបង់
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                saving ||
                !form.athletesId ||
                !form.eventsId ||
                !form.sportsId ||
                !form.organizationId
              }
            >
              {saving ? 'កំពុងរក្សាទុក...' : 'បង្កើត'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>លុបការចូលរួម</DialogTitle>
            <DialogDescription>តើអ្នកពិតជាចង់លុបការចូលរួមនេះមែនទេ?</DialogDescription>
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
