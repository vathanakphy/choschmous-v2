'use client';

import { useState } from 'react';
import { Plus, Calendar, Pencil, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerInput,
  SelectValue,
} from '@/ui/design-system/primitives/select';
import { apiClient } from '@/lib/api/client';

/* ─── Types ─────────────────────────────────────────────── */

type EventItem = {
  id: number;
  name: string;
  type: string;
  createdAt: string;
};

const EVENT_TYPES = [
  { value: 'កីឡាជាតិ', label: 'កីឡាជាតិ' },
  {
    value: 'កីឡាឧត្តមសិក្សា និងមធ្យមសិក្សា​បចេ្ចកទេសថ្នាក់ជាតិថ្នាក់ជាតិ',
    label: 'កីឡាឧត្តមសិក្សា',
  },
  { value: 'សិស្សមធ្យមសិក្សា​ថ្នាក់ជាតិ', label: 'មធ្យមសិក្សា' },
  { value: 'កីឡាសិស្សបថមសិក្សាជាតិ', label: 'បថមសិក្សា' },
];

/* ─── Component ─────────────────────────────────────────── */

export function EventsPage() {
  const list = usePagedList<EventItem>(ROUTES.API.EVENTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState({ name_kh: '', type: '' });
  const [saving, setSaving] = useState(false);

  /* ── Dialog handlers ── */
  const openCreate = () => {
    setEditing(null);
    setForm({ name_kh: '', type: '' });
    setDialogOpen(true);
  };

  const openEdit = (e: EventItem) => {
    setEditing(e);
    setForm({ name_kh: e.name, type: e.type });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiClient.patch(`${ROUTES.API.EVENTS}/${editing.id}`, form);
      } else {
        await apiClient.post(ROUTES.API.EVENTS, form);
      }
      setDialogOpen(false);
      list.reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await apiClient.delete(`${ROUTES.API.EVENTS}/${deleteTarget.id}`);
    setDeleteTarget(null);
    list.reload();
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /* ── Render ── */
  return (
    <div className="space-y-6">
      <PageHeader
        title="ព្រឹត្តិការណ៍"
        subtitle="គ្រប់គ្រងព្រឹត្តិការណ៍កីឡាទាំងអស់"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            បន្ថែមព្រឹត្តិការណ៍
          </Button>
        }
      />

      {/* ── Search ── */}
      <SearchInput
        value={list.search}
        onChange={list.setSearch}
        placeholder="ស្វែងរកព្រឹត្តិការណ៍..."
        className="max-w-sm"
      />

      {/* ── Error ── */}
      {list.error && (
        <div className="border-destructive/40 bg-destructive/10 rounded-xl border px-5 py-4">
          <p className="text-destructive text-sm">{list.error}</p>
        </div>
      )}

      {/* ── Table ── */}
      {list.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : list.data.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12" />}
          title="មិនមានព្រឹត្តិការណ៍"
          description="ចាប់ផ្តើមបន្ថែមព្រឹត្តិការណ៍កីឡាថ្មី"
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              បន្ថែមព្រឹត្តិការណ៍
            </Button>
          }
        />
      ) : (
        <div className="bg-card rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>ឈ្មោះ</TableHead>
                <TableHead>ប្រភេទ</TableHead>
                <TableHead>កាលបរិច្ឆេទ</TableHead>
                <TableHead className="text-right">សកម្មភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.data.map((evt, idx) => (
                <TableRow key={evt.id}>
                  <TableCell className="text-muted-foreground">
                    {(list.page - 1) * list.pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{evt.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{evt.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(evt.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(evt)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(evt)}>
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

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'កែសម្រួលព្រឹត្តិការណ៍' : 'បន្ថែមព្រឹត្តិការណ៍'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'កែសម្រួលព័ត៌មានព្រឹត្តិការណ៍ដែលមានស្រាប់'
                : 'បំពេញព័ត៌មានដើម្បីបង្កើតព្រឹត្តិការណ៍ថ្មី'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>ឈ្មោះព្រឹត្តិការណ៍</Label>
              <Input
                value={form.name_kh}
                onChange={(e) => setForm((f) => ({ ...f, name_kh: e.target.value }))}
                placeholder="ឈ្មោះជាភាសាខ្មែរ"
              />
            </div>
            <div className="space-y-2">
              <Label>ប្រភេទ</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTriggerInput className="w-full">
                  <SelectValue placeholder="ជ្រើសរើសប្រភេទ" />
                </SelectTriggerInput>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
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
            <Button onClick={handleSave} disabled={saving || !form.name_kh || !form.type}>
              {saving ? 'កំពុងរក្សាទុក...' : editing ? 'រក្សាទុក' : 'បង្កើត'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>លុបព្រឹត្តិការណ៍</DialogTitle>
            <DialogDescription>
              តើអ្នកពិតជាចង់លុប &ldquo;{deleteTarget?.name}&rdquo; មែនទេ?
              សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
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
