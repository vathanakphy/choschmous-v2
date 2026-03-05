'use client';

import { useState } from 'react';
import { Plus, Link2, Trash2 } from 'lucide-react';
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

type LinkItem = {
  id: number;
  eventsId: number | null;
  sportsId: number | null;
  organizationId: number | null;
  createdAt: string;
};

type RefItem = { id: number; name: string };

export function AssignmentsPage() {
  const list = usePagedList<LinkItem>(ROUTES.API.SPORT_EVENT_ORGS, { pageSize: 50 });

  const mapRef = (item: any): RefItem => ({
    id: item.id,
    name: item.name ?? item.name_kh ?? '',
  });

  const { data: sports } = useFetchList<RefItem>(`${ROUTES.API.SPORTS}?limit=500`, mapRef);
  const { data: events } = useFetchList<RefItem>(`${ROUTES.API.EVENTS}?limit=500`, mapRef);
  const { data: orgs } = useFetchList<RefItem>(`${ROUTES.API.ORGANIZATIONS}?limit=500`, mapRef);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [form, setForm] = useState({ events_id: '', sports_id: '', organization_id: '' });
  const [saving, setSaving] = useState(false);

  const sportMap = Object.fromEntries(sports.map((s) => [s.id, s.name]));
  const eventMap = Object.fromEntries(events.map((e) => [e.id, e.name]));
  const orgMap = Object.fromEntries(orgs.map((o) => [o.id, o.name]));

  const openCreate = () => {
    setForm({ events_id: '', sports_id: '', organization_id: '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.post(ROUTES.API.SPORT_EVENT_ORGS, {
        events_id: Number(form.events_id),
        sports_id: Number(form.sports_id),
        organization_id: Number(form.organization_id),
      });
      setDialogOpen(false);
      list.reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await apiClient.delete(`${ROUTES.API.SPORT_EVENT_ORGS}/${deleteTarget.id}`);
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
        title="ការចាត់តាំង"
        subtitle="គ្រប់គ្រងទំនាក់ទំនងរវាង កីឡា × ព្រឹត្តិការណ៍ × ស្ថាប័ន"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            បន្ថែមការចាត់តាំង
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
          title="មិនមានការចាត់តាំង"
          description="ចាប់ផ្តើមភ្ជាប់កីឡា ព្រឹត្តិការណ៍ និងស្ថាប័នចូលគ្នា"
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              បន្ថែមការចាត់តាំង
            </Button>
          }
        />
      ) : (
        <div className="bg-card rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>ព្រឹត្តិការណ៍</TableHead>
                <TableHead>កីឡា</TableHead>
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
                    <Badge variant="secondary">
                      {link.eventsId ? (eventMap[link.eventsId] ?? `#${link.eventsId}`) : '—'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {link.sportsId ? (sportMap[link.sportsId] ?? `#${link.sportsId}`) : '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {link.organizationId
                      ? (orgMap[link.organizationId] ?? `#${link.organizationId}`)
                      : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(link.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(link)}>
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
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

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>បន្ថែមការចាត់តាំង</DialogTitle>
            <DialogDescription>ភ្ជាប់កីឡា ព្រឹត្តិការណ៍ និងស្ថាប័នចូលគ្នា</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>ព្រឹត្តិការណ៍</Label>
              <Select
                value={form.events_id}
                onValueChange={(v) => setForm((f) => ({ ...f, events_id: v }))}
              >
                <SelectTriggerInput className="w-full">
                  <SelectValue placeholder="ជ្រើសរើសព្រឹត្តិការណ៍" />
                </SelectTriggerInput>
                <SelectContent>
                  {events.map((e) => (
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
                value={form.sports_id}
                onValueChange={(v) => setForm((f) => ({ ...f, sports_id: v }))}
              >
                <SelectTriggerInput className="w-full">
                  <SelectValue placeholder="ជ្រើសរើសកីឡា" />
                </SelectTriggerInput>
                <SelectContent>
                  {sports.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ស្ថាប័ន</Label>
              <Select
                value={form.organization_id}
                onValueChange={(v) => setForm((f) => ({ ...f, organization_id: v }))}
              >
                <SelectTriggerInput className="w-full">
                  <SelectValue placeholder="ជ្រើសរើសស្ថាប័ន" />
                </SelectTriggerInput>
                <SelectContent>
                  {orgs.map((o) => (
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
              disabled={saving || !form.events_id || !form.sports_id || !form.organization_id}
            >
              {saving ? 'កំពុងរក្សាទុក...' : 'បង្កើត'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>លុបការចាត់តាំង</DialogTitle>
            <DialogDescription>តើអ្នកពិតជាចង់លុបការចាត់តាំងនេះមែនទេ?</DialogDescription>
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
