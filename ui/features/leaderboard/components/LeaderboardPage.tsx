'use client';

import { BarChart3 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { usePagedList } from '@/ui/hooks/usePagedList';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { StatPill } from '@/ui/components/data-display/StatPill';
import { PaginationBar } from '@/ui/components/navigation/PaginationBar';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
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

type PPSItem = {
  id: number;
  sportsEventsId: number | null;
  femaleCount: number;
  maleCount: number;
  createdAt: string;
};

type AssignmentItem = {
  id: number;
  eventsId: number | null;
  sportsId: number | null;
  organizationId: number | null;
};

type NamedItem = { id: number; name: string };

export function LeaderboardPage() {
  const list = usePagedList<PPSItem>(ROUTES.API.PARTICIPATION_PER_SPORT, { pageSize: 100 });

  // Lookup data
  const mapNamed = (r: any): NamedItem => ({ id: r.id, name: r.name ?? r.name_kh ?? '' });
  const mapAssign = (r: any): AssignmentItem => ({
    id: r.id,
    eventsId: r.eventsId ?? null,
    sportsId: r.sportsId ?? null,
    organizationId: r.organizationId ?? null,
  });
  const assignments = useFetchList<AssignmentItem>(
    `${ROUTES.API.SPORT_EVENT_ORGS}?limit=500`,
    mapAssign
  );
  const events = useFetchList<NamedItem>(`${ROUTES.API.EVENTS}?limit=500`, mapNamed);
  const sports = useFetchList<NamedItem>(`${ROUTES.API.SPORTS}?limit=500`, mapNamed);
  const organizations = useFetchList<NamedItem>(`${ROUTES.API.ORGANIZATIONS}?limit=500`, mapNamed);

  const assignMap = useMemo(() => {
    const m = new Map<number, AssignmentItem>();
    for (const a of assignments.data) m.set(a.id, a);
    return m;
  }, [assignments.data]);

  const name = useCallback((items: NamedItem[], id: number | null) => {
    if (id == null) return '—';
    return items.find((i) => i.id === id)?.name ?? `#${id}`;
  }, []);

  const totalMale = list.data.reduce((s, r) => s + r.maleCount, 0);
  const totalFemale = list.data.reduce((s, r) => s + r.femaleCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="តារាងចំណាត់ថ្នាក់" subtitle="ស្ថិតិចំនួនអ្នកចូលរួមតាមប្រភេទកីឡា" />

      <div className="flex flex-wrap gap-3">
        <StatPill label="សរុបប្រុស" value={totalMale} />
        <StatPill label="សរុបស្រី" value={totalFemale} />
        <StatPill label="សរុបទាំងអស់" value={totalMale + totalFemale} />
      </div>

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
          icon={<BarChart3 className="h-12 w-12" />}
          title="មិនមានទិន្នន័យ"
          description="មិនមានស្ថិតិការចូលរួមនៅឡើយទេ"
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
                  <TableHead className="text-center">ប្រុស</TableHead>
                  <TableHead className="text-center">ស្រី</TableHead>
                  <TableHead className="text-center">សរុប</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.data.map((row, idx) => {
                  const a = row.sportsEventsId != null ? assignMap.get(row.sportsEventsId) : null;
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>{a ? name(events.data, a.eventsId) : '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{a ? name(sports.data, a.sportsId) : '—'}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {a ? name(organizations.data, a.organizationId) : '—'}
                      </TableCell>
                      <TableCell className="text-center font-medium">{row.maleCount}</TableCell>
                      <TableCell className="text-center font-medium">{row.femaleCount}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{row.maleCount + row.femaleCount}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <PaginationBar
            page={list.page}
            totalPages={list.totalPages}
            total={list.total}
            pageSize={100}
            onPageChange={list.setPage}
          />
        </>
      )}
    </div>
  );
}
