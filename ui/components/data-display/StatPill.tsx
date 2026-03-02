'use client';

import { cn } from '@/lib/utils';

type StatPillProps = {
  label: string;
  value: string | number;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

export function StatPill({ label, value, active, onClick, icon, className }: StatPillProps) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:bg-muted/50',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {icon}
      <span>{label}</span>
      <span
        className={cn(
          'ml-1 rounded-full px-2 py-0.5 text-xs font-bold',
          active
            ? 'bg-primary-foreground/20 text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {value}
      </span>
    </Comp>
  );
}
