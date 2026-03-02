'use client';

import { useState } from 'react';
import { Users, Eye, Search } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { SearchInput } from '@/ui/components/forms/SearchInput';
import { PaginationBar } from '@/ui/components/navigation/PaginationBar';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
import { StatPill } from '@/ui/components/data-display/StatPill';
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
  DialogDescription,
} from '@/ui/design-system/primitives/dialog';

type ParticipantItem = {
  id: number;
  khFamilyName: string;
  khGivenName: string;
  enFamilyName: string;
  enGivenName: string;
  phone: string;
  gender: string;
  nationality: string;
  dateOfBirth: string;
  idDocumentType: string;
  address: string | null;
  photoPath: string | null;
  createdAt: string;
};

const GENDER_LABEL: Record<string, string> = {
  male: 'ប្រុស',
  female: 'ស្រី',
  other: 'ផ្សេងទៀត',
};

export function ParticipantsPage() {
  const list = usePagedList<ParticipantItem>(ROUTES.API.ENROLLMENTS);
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [detailItem, setDetailItem] = useState<ParticipantItem | null>(null);

  // Client-side gender filter
  const filtered =
    genderFilter === 'all' ? list.data : list.data.filter((p) => p.gender === genderFilter);

  const genderCounts = list.data.reduce(
    (acc, p) => {
      acc[p.gender] = (acc[p.gender] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('km-KH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '—';

  const initials = (p: ParticipantItem) => {
    const first = (p.khGivenName || p.enGivenName || '?')[0];
    const last = (p.khFamilyName || p.enFamilyName || '?')[0];
    return `${last}${first}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="អ្នកចូលរួម" subtitle="គ្រប់គ្រងអ្នកចុះឈ្មោះទាំងអស់" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={list.search}
          onChange={list.setSearch}
          placeholder="ស្វែងរកអ្នកចូលរួម..."
          className="w-72"
        />
        <div className="flex gap-2">
          <StatPill
            label="ទាំងអស់"
            value={list.total}
            active={genderFilter === 'all'}
            onClick={() => setGenderFilter('all')}
          />
          <StatPill
            label="ប្រុស"
            value={genderCounts['male'] ?? 0}
            active={genderFilter === 'male'}
            onClick={() => setGenderFilter('male')}
          />
          <StatPill
            label="ស្រី"
            value={genderCounts['female'] ?? 0}
            active={genderFilter === 'female'}
            onClick={() => setGenderFilter('female')}
          />
        </div>
      </div>

      {list.error && (
        <div className="border-destructive/40 bg-destructive/10 rounded-xl border px-5 py-4">
          <p className="text-destructive text-sm">{list.error}</p>
        </div>
      )}

      {list.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="មិនមានអ្នកចូលរួម"
          description="នៅមិនទាន់មានការចុះឈ្មោះ"
        />
      ) : (
        <div className="bg-card rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>ឈ្មោះ</TableHead>
                <TableHead>ភេទ</TableHead>
                <TableHead>ទូរស័ព្ទ</TableHead>
                <TableHead>សញ្ជាតិ</TableHead>
                <TableHead>ថ្ងៃចុះឈ្មោះ</TableHead>
                <TableHead className="text-right">មើល</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p, idx) => (
                <TableRow key={p.id}>
                  <TableCell className="text-muted-foreground">
                    {(list.page - 1) * list.pageSize + idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold">
                        {initials(p)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {p.khFamilyName} {p.khGivenName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {p.enFamilyName} {p.enGivenName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.gender === 'male'
                          ? 'default'
                          : p.gender === 'female'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {GENDER_LABEL[p.gender] ?? p.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {p.phone || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.nationality || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(p.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => setDetailItem(p)}>
                      <Eye className="h-4 w-4" />
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

      {/* Detail Dialog */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ព័ត៌មានអ្នកចូលរួម</DialogTitle>
            <DialogDescription>ព័ត៌មានលម្អិតរបស់អ្នកចុះឈ្មោះ</DialogDescription>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold">
                  {initials(detailItem)}
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {detailItem.khFamilyName} {detailItem.khGivenName}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {detailItem.enFamilyName} {detailItem.enGivenName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ភេទ</p>
                  <p className="font-medium">
                    {GENDER_LABEL[detailItem.gender] ?? detailItem.gender}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">ទូរស័ព្ទ</p>
                  <p className="font-medium">{detailItem.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">សញ្ជាតិ</p>
                  <p className="font-medium">{detailItem.nationality || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ថ្ងៃកំណើត</p>
                  <p className="font-medium">{fmtDate(detailItem.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ប្រភេទឯកសារ</p>
                  <p className="font-medium">{detailItem.idDocumentType || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ថ្ងៃចុះឈ្មោះ</p>
                  <p className="font-medium">{fmtDate(detailItem.createdAt)}</p>
                </div>
                {detailItem.address && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">អាសយដ្ឋាន</p>
                    <p className="font-medium">{detailItem.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
