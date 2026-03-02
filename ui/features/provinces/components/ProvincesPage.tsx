'use client';

import { useState } from 'react';
import { Plus, MapPin, Pencil, Trash2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { SearchInput } from '@/ui/components/forms/SearchInput';
import { PaginationBar } from '@/ui/components/navigation/PaginationBar';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
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

type ProvinceItem = {
  id: number;
  name: string;
  type: string;
  code: string | null;
  createdAt: string;
};

export function ProvincesPage() {
  // Provinces are organizations with type='province'
  // The API returns all orgs; we filter client-side for type=province
  const list = usePagedList<ProvinceItem>(ROUTES.API.ORGANIZATIONS, { pageSize: 50 });

  const provinces = list.data.filter((p) => p.type === 'province');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProvinceItem | null>(null);
  const [editing, setEditing] = useState<ProvinceItem | null>(null);
  const [form, setForm] = useState({ name_kh: '', code: '' });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ name_kh: '', code: '' });
    setDialogOpen(true);
  };

  const openEdit = (p: ProvinceItem) => {
    setEditing(p);
    setForm({ name_kh: p.name, code: p.code ?? '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { name_kh: form.name_kh, type: 'province', code: form.code };
      if (editing) {
        await apiClient.patch(`${ROUTES.API.ORGANIZATIONS}/${editing.id}`, body);
      } else {
        await apiClient.post(ROUTES.API.ORGANIZATIONS, body);
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
        title="ខេត្ត / រាជធានី"
        subtitle="គ្រប់គ្រងខេត្ត និងរាជធានីទាំងអស់"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            បន្ថែមខេត្ត
          </Button>
        }
      />

      <SearchInput
        value={list.search}
        onChange={list.setSearch}
        placeholder="ស្វែងរកខេត្ត..."
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
      ) : provinces.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-12 w-12" />}
          title="មិនមានខេត្ត"
          description="ចាប់ផ្តើមបន្ថែមខេត្តថ្មី"
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              បន្ថែមខេត្ត
            </Button>
          }
        />
      ) : (
        <div className="bg-card rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>ឈ្មោះខេត្ត</TableHead>
                <TableHead>កូដ</TableHead>
                <TableHead>កាលបរិច្ឆេទ</TableHead>
                <TableHead className="text-right">សកម្មភាព</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provinces.map((prov, idx) => (
                <TableRow key={prov.id}>
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{prov.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {prov.code ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(prov.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(prov)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(prov)}>
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

      {/* Create / Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'កែសម្រួលខេត្ត' : 'បន្ថែមខេត្ត'}</DialogTitle>
            <DialogDescription>
              {editing ? 'កែសម្រួលព័ត៌មានខេត្ត' : 'បំពេញព័ត៌មានដើម្បីបង្កើតខេត្តថ្មី'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>ឈ្មោះខេត្ត</Label>
              <Input
                value={form.name_kh}
                onChange={(e) => setForm((f) => ({ ...f, name_kh: e.target.value }))}
                placeholder="ឧ. ភ្នំពេញ"
              />
            </div>
            <div className="space-y-2">
              <Label>កូដ</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="ឧ. PNP"
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

      {/* Delete */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>លុបខេត្ត</DialogTitle>
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
