'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type StepItem = {
  id: string;
  label: string;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  completedIcon?: LucideIcon;
  isAccessible: boolean;
  icon: LucideIcon;
};

type StepSidebarProps = {
  title?: string;
  steps: StepItem[];
  totalSteps: number;
  onNavigate?: (id: string) => void;
};

export function StepSidebar({ title = 'Steps', steps, totalSteps, onNavigate }: StepSidebarProps) {
  return (
    <aside className="bg-card border-border sticky top-18 hidden h-[calc(100vh-72px)] w-80 overflow-y-auto border-r p-6 lg:flex lg:flex-col">
      <div className="space-y-2">
        <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
          {title}
        </h3>

        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => step.isAccessible && onNavigate?.(step.id)}
              disabled={!step.isAccessible}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all',
                step.isActive && 'bg-primary/10 text-primary border-primary border-l-4',
                !step.isActive &&
                  step.isCompleted &&
                  'bg-(--reg-emerald-50) text-(--reg-emerald-700)',
                !step.isActive &&
                  !step.isCompleted &&
                  step.isAccessible &&
                  'text-muted-foreground hover:bg-muted',
                !step.isAccessible && 'text-muted-foreground/40 cursor-not-allowed opacity-50'
              )}
            >
              {/* Icon circle */}
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all',
                  step.isActive && 'bg-primary text-primary-foreground',
                  step.isCompleted && !step.isActive && 'bg-(--reg-emerald-600) text-white',
                  !step.isActive && !step.isCompleted && 'bg-muted text-muted-foreground'
                )}
              >
                {step.isCompleted && !step.isActive ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{step.label}</div>
                <div className="text-muted-foreground text-xs">
                  Step {step.index + 1} of {totalSteps}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
