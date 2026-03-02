'use client';

import { ClipboardList, Plus } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { SearchInput } from '@/ui/components/forms/SearchInput';
import { PaginationBar } from '@/ui/components/navigation/PaginationBar';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
import { StatPill } from '@/ui/components/data-display/StatPill';
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
import { useFetchList } from '@/ui/hooks/useFetchList';
import { useCallback, useMemo } from 'react';

type LinkItem = {
  id: number;
  eventsId: number | null;
  sportsId: number | null;
  organizationId: number | null;
  createdAt: string;
};

type NamedItem = { id: number; name: string };

export function SurveyAdminPage() {
  // Survey submissions create sport-event-org links — show them here
  const list = usePagedList<LinkItem>(ROUTES.API.SPORT_EVENT_ORGS, { pageSize: 50 });

  const mapNamed = (r: any): NamedItem => ({ id: r.id, name: r.name ?? r.name_kh ?? '' });
  const { data: events } = useFetchList<NamedItem>(`${ROUTES.API.EVENTS}?limit=500`, mapNamed);
  const { data: sports } = useFetchList<NamedItem>(`${ROUTES.API.SPORTS}?limit=500`, mapNamed);
  const { data: orgs } = useFetchList<NamedItem>(`${ROUTES.API.ORGANIZATIONS}?limit=500`, mapNamed);

  const name = useCallback((items: NamedItem[], id: number | null) => {
    if (id == null) return '—';
    return items.find((i) => i.id === id)?.name ?? `#${id}`;
  }, []);

  // Group by event for stat pills
  const byEvent = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of list.data) {
      const eName = name(events, r.eventsId);
      m.set(eName, (m.get(eName) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [list.data, events, name]);

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' })
      : '—';

  return (
    <div className="space-y-6">
      <PageHeader
        title="ស្ទង់មតិ (Admin)"
        subtitle="មើលការឆ្លើយស្ទង់មតិទាំងអស់ — កីឡាដែលស្ថាប័នចុះឈ្មោះ"
      />

      <div className="flex flex-wrap gap-3">
        <StatPill label="សរុបចម្លើយ" value={list.total} />
        {byEvent.slice(0, 4).map(([eName, count]) => (
          <StatPill key={eName} label={eName} value={count} />
        ))}
      </div>

      <SearchInput
        value={list.search}
        onChange={list.setSearch}
        placeholder="ស្វែងរក..."
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
          icon={<ClipboardList className="h-12 w-12" />}
          title="មិនមានទិន្នន័យស្ទង់មតិ"
          description="មិនមានស្ថាប័នណាមួយបានឆ្លើយស្ទង់មតិនៅឡើយ"
        />
      ) : (
        <>
          <div className="bg-card rounded-2xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>ព្រឹត្តិការណ៍</TableHead>
                  <TableHead>កីឡា</TableHead>
                  <TableHead>ស្ថាប័ន</TableHead>
                  <TableHead>កាលបរិច្ឆេទ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-muted-foreground">
                      {(list.page - 1) * 50 + idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">{name(events, row.eventsId)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{name(sports, row.sportsId)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {name(orgs, row.organizationId)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fmtDate(row.createdAt)}
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
    </div>
  );
}
