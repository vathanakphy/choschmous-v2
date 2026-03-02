'use client';

import { useState } from 'react';
import { Plus, Trophy, Pencil, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
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
import { apiClient } from '@/lib/api/client';

type SportItem = {
  id: number;
  name: string;
  sportType: string | null;
  createdAt: string;
};

export function SportsPage() {
  const list = usePagedList<SportItem>(ROUTES.API.SPORTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SportItem | null>(null);
  const [editing, setEditing] = useState<SportItem | null>(null);
  const [form, setForm] = useState({ name_kh: '', sport_type: '' });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ name_kh: '', sport_type: '' });
    setDialogOpen(true);
  };

  const openEdit = (s: SportItem) => {
    setEditing(s);
    setForm({ name_kh: s.name, sport_type: s.sportType ?? '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiClient.patch(`${ROUTES.API.SPORTS}/${editing.id}`, form);
      } else {
        await apiClient.post(ROUTES.API.SPORTS, form);
      }
      setDialogOpen(false);
      list.reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await apiClient.delete(`${ROUTES.API.SPORTS}/${deleteTarget.id}`);
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
        title="កីឡា"
        subtitle="គ្រប់គ្រងប្រភេទកីឡាទាំងអស់"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            បន្ថែមកីឡា
          </Button>
        }
      />

      <SearchInput
        value={list.search}
        onChange={list.setSearch}
        placeholder="ស្វែងរកកីឡា..."
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
          icon={<Trophy className="h-12 w-12" />}
          title="មិនមានកីឡា"
          description="ចាប់ផ្តើមបន្ថែមកីឡាថ្មី"
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              បន្ថែមកីឡា
            </Button>
          }
        />
      ) : (
        <div className="bg-card rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>ឈ្មោះកីឡា</TableHead>
                <TableHead>ប្រភេទ</TableHead>
                <TableHead>កាលបរិច្ឆេទ</TableHead>
                <TableHead className="text-right">សកម្មភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.data.map((sport, idx) => (
                <TableRow key={sport.id}>
                  <TableCell className="text-muted-foreground">
                    {(list.page - 1) * list.pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{sport.name}</TableCell>
                  <TableCell>
                    {sport.sportType ? (
                      <Badge variant="outline">{sport.sportType}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {fmtDate(sport.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(sport)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(sport)}>
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
            <DialogTitle>{editing ? 'កែសម្រួលកីឡា' : 'បន្ថែមកីឡា'}</DialogTitle>
            <DialogDescription>
              {editing ? 'កែសម្រួលព័ត៌មានកីឡា' : 'បំពេញព័ត៌មានដើម្បីបង្កើតកីឡាថ្មី'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>ឈ្មោះកីឡា</Label>
              <Input
                value={form.name_kh}
                onChange={(e) => setForm((f) => ({ ...f, name_kh: e.target.value }))}
                placeholder="ឧ. បាល់ទាត់"
              />
            </div>
            <div className="space-y-2">
              <Label>ប្រភេទកីឡា</Label>
              <Input
                value={form.sport_type}
                onChange={(e) => setForm((f) => ({ ...f, sport_type: e.target.value }))}
                placeholder="ឧ. ក្រុម, បុគ្គល"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              បោះបង់
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.name_kh || !form.sport_type}>
              {saving ? 'កំពុងរក្សាទុក...' : editing ? 'រក្សាទុក' : 'បង្កើត'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>លុបកីឡា</DialogTitle>
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
