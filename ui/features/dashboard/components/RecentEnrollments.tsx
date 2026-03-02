'use client';

import { UserRound, Phone } from 'lucide-react';
import { Badge } from '@/ui/design-system/primitives/Badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/ui/design-system/primitives/table';
import type { RecentEnrollment } from '../types/Dashboard.types';

type RecentEnrollmentsProps = {
  enrollments: RecentEnrollment[];
  isLoading: boolean;
};

function formatDate(iso: string) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function genderLabel(g: string) {
  const lower = g.toLowerCase();
  if (lower === 'male') return { label: 'ប្រុស', variant: 'default' as const };
  if (lower === 'female') return { label: 'ស្រី', variant: 'secondary' as const };
  return { label: g || '-', variant: 'outline' as const };
}

export function RecentEnrollments({ enrollments, isLoading }: RecentEnrollmentsProps) {
  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="bg-chart-4/15 flex h-8 w-8 items-center justify-center rounded-lg">
          <UserRound className="text-chart-4 h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold">ការចុះឈ្មោះថ្មីៗ</h2>
      </div>

      {!isLoading && enrollments.length === 0 ? (
        <p className="bg-muted text-muted-foreground rounded-xl px-4 py-8 text-center text-sm">
          មិនមានកំណត់ត្រាចុះឈ្មោះថ្មីទេ។
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs">លេខ</TableHead>
                <TableHead className="text-xs">ឈ្មោះខ្មែរ</TableHead>
                <TableHead className="text-xs">ឈ្មោះអង់គ្លេស</TableHead>
                <TableHead className="text-xs">ភេទ</TableHead>
                <TableHead className="text-xs">ទូរស័ព្ទ</TableHead>
                <TableHead className="text-xs">កាលបរិច្ឆេទ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((e) => {
                const g = genderLabel(e.gender);
                return (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      #{e.id}
                    </TableCell>
                    <TableCell className="font-medium">{e.khName}</TableCell>
                    <TableCell className="text-muted-foreground">{e.enName || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={g.variant} className="text-[10px]">
                        {g.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {e.phone ? (
                        <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3" />
                          {e.phone}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatDate(e.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
