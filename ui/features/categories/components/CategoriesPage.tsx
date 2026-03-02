'use client';

import { useState } from 'react';
import { Plus, Layers, Pencil, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
import { useFetchList } from '@/ui/hooks/useFetchList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { SearchInput } from '@/ui/components/forms/SearchInput';
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
import { Input } from '@/ui/design-system/primitives/Input';
import { Label } from '@/ui/design-system/primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerInput,
  SelectValue,
} from '@/ui/design-system/primitives/select';
import { apiClient } from '@/lib/api/client';

type CategoryItem = {
  id: number;
  name: string;
  sportsId: number | null;
  eventsId: number | null;
  createdAt: string;
};

type RefItem = { id: number; name: string };

export function CategoriesPage() {
  const list = usePagedList<CategoryItem>(ROUTES.API.CATEGORIES);
  const { data: sports } = useFetchList<RefItem>(`${ROUTES.API.SPORTS}?limit=500`, (s) => ({
    id: s.id,
    name: s.name ?? s.name_kh ?? '',
  }));
  const { data: events } = useFetchList<RefItem>(`${ROUTES.API.EVENTS}?limit=500`, (e) => ({
    id: e.id,
    name: e.name ?? e.name_kh ?? '',
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [editing, setEditing] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState({ category: '', sports_id: '', events_id: '' });
  const [saving, setSaving] = useState(false);

  const sportMap = Object.fromEntries(sports.map((s) => [s.id, s.name]));
  const eventMap = Object.fromEntries(events.map((e) => [e.id, e.name]));

  const openCreate = () => {
    setEditing(null);
    setForm({ category: '', sports_id: '', events_id: '' });
    setDialogOpen(true);
  };

  const openEdit = (c: CategoryItem) => {
    setEditing(c);
    setForm({
      category: c.name,
      sports_id: c.sportsId ? String(c.sportsId) : '',
      events_id: c.eventsId ? String(c.eventsId) : '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        category: form.category,
        sports_id: form.sports_id ? Number(form.sports_id) : null,
        events_id: form.events_id ? Number(form.events_id) : null,
      };
      if (editing) {
        await apiClient.patch(`${ROUTES.API.CATEGORIES}/${editing.id}`, body);
      } else {
        await apiClient.post(ROUTES.API.CATEGORIES, body);
      }
      setDialogOpen(false);
      list.reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await apiClient.delete(`${ROUTES.API.CATEGORIES}/${deleteTarget.id}`);
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
        title="ប្រភេទកីឡា"
        subtitle="គ្រប់គ្រងប្រភេទកីឡា (Categories)"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            បន្ថែមប្រភេទ
          </Button>
        }
      />

      <SearchInput
        value={list.search}
        onChange={list.setSearch}
        placeholder="ស្វែងរកប្រភេទ..."
        className="max-w-sm"
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
          icon={<Layers className="h-12 w-12" />}
          title="មិនមានប្រភេទ"
          description="ចាប់ផ្តើមបន្ថែមប្រភេទកីឡាថ្មី"
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              បន្ថែមប្រភេទ
            </Button>
          }
        />
      ) : (
        <div className="bg-card rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>ឈ្មោះប្រភេទ</TableHead>
                <TableHead>កីឡា</TableHead>
                <TableHead>ព្រឹត្តិការណ៍</TableHead>
                <TableHead>កាលបរិច្ឆេទ</TableHead>
                <TableHead className="text-right">សកម្មភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.data.map((cat, idx) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-muted-foreground">
                    {(list.page - 1) * list.pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    {cat.sportsId ? (
                      <Badge variant="outline">
                        {sportMap[cat.sportsId] ?? `#${cat.sportsId}`}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {cat.eventsId ? (
                      <Badge variant="secondary">
                        {eventMap[cat.eventsId] ?? `#${cat.eventsId}`}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(cat.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(cat)}>
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'កែសម្រួលប្រភេទ' : 'បន្ថែមប្រភេទ'}</DialogTitle>
            <DialogDescription>
              {editing ? 'កែសម្រួលព័ត៌មានប្រភេទ' : 'បំពេញព័ត៌មានដើម្បីបង្កើតប្រភេទថ្មី'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>ឈ្មោះប្រភេទ</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="ឧ. បុរស U18, នារី Open"
              />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              បោះបង់
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.category}>
              {saving ? 'កំពុងរក្សាទុក...' : editing ? 'រក្សាទុក' : 'បង្កើត'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>លុបប្រភេទ</DialogTitle>
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
