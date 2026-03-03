'use client';

import { useState } from 'react';
import { Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { PageHeader } from '@/ui/components/layout/PageHeader';
import { Button } from '@/ui/design-system/primitives/Button';
import { Badge } from '@/ui/design-system/primitives/Badge';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import { EmptyState } from '@/ui/components/data-display/EmptyState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/design-system/primitives/table';
import { useFetchList } from '@/ui/hooks/useFetchList';
import { PEventStep } from '@/ui/features/participation-number/steps/PEventStep';
import { POrgStep } from '@/ui/features/participation-number/steps/POrgStep';
import { PSportStep } from '@/ui/features/participation-number/steps/PSportStep';

// ── Types ──────────────────────────────────────────────────────

type FlowStep = 'event' | 'org' | 'sport' | 'result';

interface Selection {
  eventId: string;
  eventName: string;
  organizationId: string;
  organizationName: string;
  sportId: string;
  sportName: string;
}

interface AthleteRow {
  id: number;
  khFamilyName: string;
  khGivenName: string;
  enFamilyName: string;
  enGivenName: string;
  gender: string;
  dateOfBirth: string;
  createdAt: string;
}

const GENDER_LABEL: Record<string, string> = {
  male: 'ប្រុស',
  female: 'ស្រី',
  other: 'ផ្សេងទៀត',
};

const EMPTY_SELECTION: Selection = {
  eventId: '', eventName: '',
  organizationId: '', organizationName: '',
  sportId: '', sportName: '',
};

// ── Component ─────────────────────────────────────────────────

export function ParticipationSportPage() {
  const [step, setStep] = useState<FlowStep>('event');
  const [sel, setSel] = useState<Selection>(EMPTY_SELECTION);

  // Fetch athletes only when on result step with full selection
  const athletesUrl =
    step === 'result' && sel.eventId && sel.organizationId && sel.sportId
      ? `/api/participation-stats/athletes-by-sport?eventId=${sel.eventId}&orgId=${sel.organizationId}&sportId=${sel.sportId}`
      : null;

  const {
    data: athletes,
    loading,
    error: fetchError,
  } = useFetchList<AthleteRow>(
    athletesUrl,
    (raw) => raw as AthleteRow
  );

  const maleCount = athletes.filter((a) => a.gender === 'male').length;
  const femaleCount = athletes.filter((a) => a.gender === 'female').length;

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' })
      : '—';

  const initials = (a: AthleteRow) =>
    `${(a.khFamilyName || a.enFamilyName || '?')[0]}${(a.khGivenName || a.enGivenName || '?')[0]}`.toUpperCase();

  // ── Breadcrumb ─────────────────────────────────────────────

  const crumbs = [
    sel.eventName ? { label: sel.eventName, onClick: () => setStep('event') } : null,
    sel.organizationName ? { label: sel.organizationName, onClick: () => setStep('org') } : null,
    sel.sportName ? { label: sel.sportName, onClick: () => setStep('sport') } : null,
  ].filter(Boolean) as { label: string; onClick: () => void }[];

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader title="បញ្ជីកីឡាប្រកួត" subtitle="មើលបញ្ជីអ្នកចូលរួមតាមប្រភេទកីឡា" />

      {/* Breadcrumb trail */}
      {crumbs.length > 0 && (
        <nav
          className="flex flex-wrap items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm"
          style={{ backgroundColor: 'var(--reg-indigo-50)', borderColor: 'var(--reg-indigo-200)' }}
        >
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              <button
                onClick={crumb.onClick}
                className="font-medium hover:underline"
                style={{ color: 'var(--reg-indigo-700)' }}
              >
                {crumb.label}
              </button>
            </span>
          ))}
        </nav>
      )}

      {/* ── Step: pick event ── */}
      {step === 'event' && (
        <div className="bg-card rounded-2xl border p-6">
          <PEventStep
            eventId={sel.eventId}
            onSelect={(fields) => {
              setSel({ ...EMPTY_SELECTION, ...fields });
              setStep('org');
            }}
          />
        </div>
      )}

      {/* ── Step: pick org ── */}
      {step === 'org' && (
        <div className="bg-card rounded-2xl border p-6">
          <POrgStep
            eventId={sel.eventId}
            organizationId={sel.organizationId}
            onSelect={(fields) => {
              setSel((s) => ({ ...s, ...fields, sportId: '', sportName: '' }));
              setStep('sport');
            }}
          />
        </div>
      )}

      {/* ── Step: pick sport ── */}
      {step === 'sport' && (
        <div className="bg-card rounded-2xl border p-6">
          <PSportStep
            eventId={sel.eventId}
            sportId={sel.sportId}
            onSelect={(fields) => {
              setSel((s) => ({ ...s, ...fields }));
              setStep('result');
            }}
          />
        </div>
      )}

      {/* ── Step: result ── */}
      {step === 'result' && (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="ប្រុស" value={loading ? null : maleCount} color="var(--reg-indigo-600)" bg="var(--reg-indigo-50)" border="var(--reg-indigo-200)" />
            <StatCard label="នារី" value={loading ? null : femaleCount} color="var(--reg-purple-600)" bg="oklch(0.97 0.015 310)" border="oklch(0.88 0.05 310)" />
            <StatCard label="សរុប" value={loading ? null : athletes.length} color="var(--reg-emerald-700)" bg="var(--reg-emerald-50)" border="oklch(0.85 0.08 155)" />
          </div>

          {/* Change sport button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep('sport')}
          >
            <ChevronLeft className="h-4 w-4" />
            ផ្លាស់ប្តូរប្រភេទកីឡា
          </Button>

          {/* Error */}
          {fetchError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
              <p className="text-sm text-destructive">{fetchError}</p>
            </div>
          )}

          {/* Loading */}
          {loading && !fetchError && (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !fetchError && athletes.length === 0 && (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="មិនមានអ្នកចូលរួម"
              description={`មិនទាន់មានការចុះឈ្មោះក្នុងកីឡា ${sel.sportName}`}
            />
          )}

          {/* Table */}
          {!loading && !fetchError && athletes.length > 0 && (
            <div className="bg-card rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>ឈ្មោះ</TableHead>
                    <TableHead>ភេទ</TableHead>
                    <TableHead>ថ្ងៃកំណើត</TableHead>
                    <TableHead>ថ្ងៃចុះឈ្មោះ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {athletes.map((athlete, idx) => (
                    <TableRow key={athlete.id}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                            style={{ backgroundColor: 'var(--reg-indigo-50)', color: 'var(--reg-indigo-600)' }}
                          >
                            {initials(athlete)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {athlete.khFamilyName} {athlete.khGivenName}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {athlete.enFamilyName} {athlete.enGivenName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            athlete.gender === 'male' ? 'default'
                            : athlete.gender === 'female' ? 'secondary'
                            : 'outline'
                          }
                        >
                          {GENDER_LABEL[athlete.gender] ?? athlete.gender}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {fmtDate(athlete.dateOfBirth)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {fmtDate(athlete.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
  bg,
  border,
}: {
  label: string;
  value: number | null;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <p className="text-2xl font-bold" style={{ color }}>
        {value === null ? '…' : value}
      </p>
      <p className="mt-1 text-sm font-semibold" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
