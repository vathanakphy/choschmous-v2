'use client';

import { useState } from 'react';
import { Plus, Building2, Pencil, Trash2 } from 'lucide-react';
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

type OrgItem = {
  id: number;
  name: string;
  type: string;
  code: string | null;
  createdAt: string;
};

const ORG_TYPES = [
  { value: 'province', label: 'ខេត្ត / រាជធានី' },
  { value: 'ministry', label: 'ក្រសួង / ស្ថាប័ន' },
];

export function OrganizationsPage() {
  const list = usePagedList<OrgItem>(ROUTES.API.ORGANIZATIONS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OrgItem | null>(null);
  const [editing, setEditing] = useState<OrgItem | null>(null);
  const [form, setForm] = useState({ name_kh: '', type: 'province', code: '' });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ name_kh: '', type: 'province', code: '' });
    setDialogOpen(true);
  };

  const openEdit = (o: OrgItem) => {
    setEditing(o);
    setForm({ name_kh: o.name, type: o.type, code: o.code ?? '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiClient.patch(`${ROUTES.API.ORGANIZATIONS}/${editing.id}`, form);
      } else {
        await apiClient.post(ROUTES.API.ORGANIZATIONS, form);
      }
      setDialogOpen(false);
      list.reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await apiClient.delete(`${ROUTES.API.ORGANIZATIONS}/${deleteTarget.id}`);
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
        title="ស្ថាប័ន"
        subtitle="គ្រប់គ្រងខេត្ត និងស្ថាប័នទាំងអស់"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            បន្ថែមស្ថាប័ន
          </Button>
        }
      />

      <SearchInput
        value={list.search}
        onChange={list.setSearch}
        placeholder="ស្វែងរកស្ថាប័ន..."
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
          icon={<Building2 className="h-12 w-12" />}
          title="មិនមានស្ថាប័ន"
          description="ចាប់ផ្តើមបន្ថែមស្ថាប័នថ្មី"
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              បន្ថែមស្ថាប័ន
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
                <TableHead>កូដ</TableHead>
                <TableHead>កាលបរិច្ឆេទ</TableHead>
                <TableHead className="text-right">សកម្មភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.data.map((org, idx) => (
                <TableRow key={org.id}>
                  <TableCell className="text-muted-foreground">
                    {(list.page - 1) * list.pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>
                    <Badge variant={org.type === 'province' ? 'success' : 'secondary'}>
                      {org.type === 'province' ? 'ខេត្ត' : 'ស្ថាប័ន'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {org.code ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(org.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(org)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(org)}>
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
            <DialogTitle>{editing ? 'កែសម្រួលស្ថាប័ន' : 'បន្ថែមស្ថាប័ន'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'កែសម្រួលព័ត៌មានស្ថាប័នដែលមានស្រាប់'
                : 'បំពេញព័ត៌មានដើម្បីបង្កើតស្ថាប័នថ្មី'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>ឈ្មោះស្ថាប័ន</Label>
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
                  {ORG_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>កូដ</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="ឧ. PNP, BTB"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              បោះបង់
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.name_kh || !form.code}>
              {saving ? 'កំពុងរក្សាទុក...' : editing ? 'រក្សាទុក' : 'បង្កើត'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>លុបស្ថាប័ន</DialogTitle>
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
