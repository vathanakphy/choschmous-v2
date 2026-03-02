'use client';

import { useState, useEffect } from 'react';
import { Users, RefreshCw, Shield } from 'lucide-react';
import { PageHeader } from '@/ui/components/layout/PageHeader';
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
import { SearchInput } from '@/ui/components/forms/SearchInput';
import { apiClient } from '@/lib/api/client';

type UserItem = {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

const ROLE_BADGE: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
  superadmin: 'destructive',
  admin: 'warning',
  user: 'default',
};

export function SessionsPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    fetch('/api/auth/session', { signal: ctrl.signal })
      .then((r) => r.json())
      .catch(() => null);

    // Fetch users list from the dashboard or users endpoint
    fetch('/api/dashboard', { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        const data = json?.data ?? json;
        // Extract users if available from dashboard data
        const userList = data?.users ?? data?.recentUsers ?? [];
        setUsers(
          Array.isArray(userList)
            ? userList.map((u: any) => ({
                id: u.id,
                email: u.email ?? '',
                name: u.name ?? u.full_name ?? '',
                role: u.role ?? 'user',
                createdAt: u.createdAt ?? u.created_at ?? '',
              }))
            : []
        );
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('មិនអាចទាញទិន្នន័យបាន');
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, []);

  const filtered = search
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' })
      : '—';

  return (
    <div className="space-y-6">
      <PageHeader title="វគ្គ / អ្នកប្រើប្រាស់" subtitle="គ្រប់គ្រងអ្នកប្រើប្រាស់ និងតួនាទី" />

      <div className="flex flex-wrap gap-3">
        <StatPill label="សរុបអ្នកប្រើប្រាស់" value={users.length} />
        {Object.entries(roleCounts).map(([role, count]) => (
          <StatPill key={role} label={role} value={count} />
        ))}
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="ស្វែងរកអ្នកប្រើប្រាស់..."
        className="max-w-sm"
      />

      {error && (
        <div className="border-destructive/40 bg-destructive/10 rounded-xl border px-5 py-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="មិនមានអ្នកប្រើប្រាស់"
          description="មិនមានអ្នកប្រើប្រាស់នៅក្នុងប្រព័ន្ធ"
        />
      ) : (
        <div className="bg-card rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>ឈ្មោះ</TableHead>
                <TableHead>អ៊ីមែល</TableHead>
                <TableHead>តួនាទី</TableHead>
                <TableHead>កាលបរិច្ឆេទ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u, idx) => (
                <TableRow key={u.id}>
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{u.name || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={ROLE_BADGE[u.role] ?? 'default'}>{u.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{fmtDate(u.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
