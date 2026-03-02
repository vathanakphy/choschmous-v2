/**
 * Shared feedback components — error banners, empty states,
 * skeleton grids, and data-fetch state wrappers.
 *
 * These eliminate dozens of near-identical inline JSX blocks
 * scattered across wizard steps and feature components.
 *
 * @example
 * <ErrorBanner message={error} />
 * <SkeletonGrid count={4} height="h-28" />
 * <FetchState loading={loading} error={error} empty={items.length === 0} emptyMessage="មិនមានទិន្នន័យ">
 *   <Grid cols={2}>{items.map(…)}</Grid>
 * </FetchState>
 */

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import { Grid } from '@/ui/components/layout/LayoutPrimitives';

// ── ErrorBanner ───────────────────────────────────────────────

interface ErrorBannerProps {
  message?: string | null;
  className?: string;
}

/**
 * Inline destructive banner used at the top of wizard steps.
 * Renders nothing when `message` is falsy.
 */
export function ErrorBanner({ message, className }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      className={cn(
        'border-destructive/20 bg-destructive/10 text-destructive mb-4 flex items-center gap-2 rounded-lg border p-3 text-sm',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// ── SkeletonGrid ──────────────────────────────────────────────

interface SkeletonGridProps {
  /** Number of skeleton items to render */
  count?: number;
  /** Tailwind height class, e.g. "h-28" */
  height?: string;
  /** Grid columns (matches Grid cols prop) */
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * Placeholder grid rendered while data is loading.
 */
export function SkeletonGrid({
  count = 4,
  height = 'h-28',
  cols = 2,
  className,
}: SkeletonGridProps) {
  return (
    <Grid cols={cols} className={className}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={cn(height, 'rounded-2xl')} />
      ))}
    </Grid>
  );
}

// ── FetchState ────────────────────────────────────────────────

interface FetchStateProps {
  loading: boolean;
  error: string | null;
  /** True when data array is empty (after loading completes) */
  empty?: boolean;
  emptyMessage?: string;
  /** Skeleton props while loading */
  skeletonCount?: number;
  skeletonHeight?: string;
  skeletonCols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

/**
 * Handles the three states of a data fetch — loading, error, and empty —
 * so step components only need to render the happy-path content.
 */
export function FetchState({
  loading,
  error,
  empty,
  emptyMessage = 'មិនមានទិន្នន័យ',
  skeletonCount = 4,
  skeletonHeight = 'h-28',
  skeletonCols = 2,
  children,
}: FetchStateProps) {
  if (loading) {
    return <SkeletonGrid count={skeletonCount} height={skeletonHeight} cols={skeletonCols} />;
  }

  if (error) {
    return <p className="text-destructive py-10 text-center text-sm">{error}</p>;
  }

  if (empty) {
    return <p className="text-muted-foreground py-10 text-center text-sm">{emptyMessage}</p>;
  }

  return <>{children}</>;
}

// ── SubmitError ────────────────────────────────────────────────

interface SubmitErrorProps {
  error?: string | null;
  className?: string;
}

/**
 * Error display used inside confirmation/submit steps.
 * Slight variation on ErrorBanner — no icon, rounded-lg with lighter background.
 */
export function SubmitError({ error, className }: SubmitErrorProps) {
  if (!error) return null;
  return (
    <p
      className={cn(
        'border-destructive/20 bg-destructive/5 text-destructive rounded-lg border p-3 text-sm',
        className
      )}
    >
      {error}
    </p>
  );
}
