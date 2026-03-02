/**
 * CompletedStepLayout — shared layout for all "success / completed" wizard steps.
 *
 * Eliminates the near-identical centered-icon + heading + details + action-button
 * pattern duplicated across CompletedStep, CompletedByNumberStep, and SurveyCompletedStep.
 *
 * @example
 * <CompletedStepLayout
 *   icon={<CheckCircle2 className="h-12 w-12" />}
 *   iconClassName="bg-(--reg-emerald-50) text-chart-2"
 *   title="បានចុះឈ្មោះដោយជោគជ័យ!"
 *   titleClassName="text-chart-2"
 *   actions={<Button onClick={onGoHome}>ទំព័រដើម</Button>}
 * >
 *   <p>...</p>
 * </CompletedStepLayout>
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CompletedStepLayoutProps {
  /** The icon rendered inside the circle */
  icon: React.ReactNode;
  /** Additional classes for the icon circle (bg + text color) */
  iconClassName?: string;
  /** Size of the icon circle — defaults to 'h-20 w-20' */
  iconSize?: string;
  /** Main heading text */
  title: string;
  /** Optional extra class on heading (e.g. color override) */
  titleClassName?: string;
  /** Summary / description content below the title */
  children?: React.ReactNode;
  /** Action buttons (go home, reset, add more, etc.) */
  actions?: React.ReactNode;
  className?: string;
}

export function CompletedStepLayout({
  icon,
  iconClassName,
  iconSize = 'h-20 w-20',
  title,
  titleClassName,
  children,
  actions,
  className,
}: CompletedStepLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-2xl flex-col items-center justify-center space-y-6 py-16 text-center',
        className
      )}
    >
      <div className={cn('flex items-center justify-center rounded-full', iconSize, iconClassName)}>
        {icon}
      </div>

      <div className="space-y-2">
        <h2 className={cn('text-2xl font-bold', titleClassName)}>{title}</h2>
        {children}
      </div>

      {actions && <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>}
    </div>
  );
}
