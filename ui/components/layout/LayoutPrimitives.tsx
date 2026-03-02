/**
 * ui/design-system/primitives/LayoutPrimitives.tsx
 *
 * WHAT: Layout building blocks — cards, headers, info rows, grids.
 *       Migrated & unified from old project's patterns.tsx + shared/SectionCard.tsx
 *
 * HOW TO USE:
 *
 *   import { SectionCard, StepHeader, InfoRow, ActionFooter, Grid } from '@/ui/design-system/primitives/LayoutPrimitives'
 *
 *   // White rounded card with optional title
 *   <SectionCard title="ព័ត៌មានសម្គាល់" subtitle="បំពេញឈ្មោះ">
 *     ...children
 *   </SectionCard>
 *
 *   // Big title at top of each wizard step
 *   <StepHeader title="ជ្រើសរើសកីឡា" subtitle="ជ្រើសកីឡាដែលអ្នកចង់ប្រកួត" />
 *
 *   // Label / value row with edit button (used in ConfirmationStep)
 *   <InfoRow label="ភេទ" value="ប្រុស" onEdit={() => goToStep(4)} />
 *
 *   // Back / Next button pair
 *   <ActionFooter onBack={prevStep} onNext={nextStep} nextDisabled={!valid} />
 *
 *   // Responsive grid
 *   <Grid cols={2}> ... </Grid>
 *   <Grid cols={3} gap={6}> ... </Grid>
 */

import * as React from 'react';
import { Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/design-system/primitives/Button';

// ── SectionCard ───────────────────────────────────────────────

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  headerSlot?: React.ReactNode; // e.g. a badge or action button top-right
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  headerSlot,
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'border-border bg-card/60 space-y-4 rounded-2xl border p-5 shadow-sm sm:p-6',
        className
      )}
    >
      {(title || subtitle || headerSlot) && (
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            {title && <p className="text-foreground text-sm font-semibold">{title}</p>}
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
          {headerSlot}
        </div>
      )}
      {children}
    </div>
  );
}

// ── StepHeader ────────────────────────────────────────────────

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function StepHeader({ title, subtitle, className }: StepHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-foreground text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}

// ── InfoRow ───────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value?: string | null;
  onEdit?: () => void;
  className?: string;
}

export function InfoRow({ label, value, onEdit, className }: InfoRowProps) {
  return (
    <div
      className={cn(
        'border-border flex items-center justify-between border-b py-2.5 text-sm last:border-0',
        className
      )}
    >
      <span className="text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="text-foreground flex-1 text-right font-medium">{value || '—'}</span>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-primary/60 hover:text-primary ml-3 shrink-0 transition"
          aria-label={`Edit ${label}`}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ── ActionFooter ──────────────────────────────────────────────

interface ActionFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  showBack?: boolean;
  className?: string;
}

export function ActionFooter({
  onBack,
  onNext,
  backLabel = 'ត្រលប់',
  nextLabel = 'បន្ត',
  nextDisabled,
  loading,
  showBack = true,
  className,
}: ActionFooterProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {showBack && onBack ? (
        <Button variant="outline" type="button" onClick={onBack}>
          {backLabel}
        </Button>
      ) : (
        <div />
      )}
      {onNext && (
        <Button type="button" onClick={onNext} disabled={nextDisabled || loading} className="px-8">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>កំពុង...
            </span>
          ) : (
            nextLabel
          )}
        </Button>
      )}
    </div>
  );
}

// ── Grid ──────────────────────────────────────────────────────

const COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const;

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 2 | 3 | 4 | 6 | 8;
  className?: string;
}

export function Grid({ children, cols = 2, gap = 4, className }: GridProps) {
  return <div className={cn('grid', COLS[cols], `gap-${gap}`, className)}>{children}</div>;
}
