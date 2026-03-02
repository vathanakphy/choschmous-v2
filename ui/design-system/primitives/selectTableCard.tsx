import * as React from 'react';
import { cn } from '@/lib/utils';

interface SelectableCardProps {
  /** Main title text */
  title: React.ReactNode;
  /** Optional subtitle text */
  subtitle?: React.ReactNode;
  /** Optional description (for more detailed cards) */
  description?: React.ReactNode;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Whether the card is currently selected */
  selected?: boolean;
  /** Callback when card is selected */
  onSelect?: () => void;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Render as button or div */
  as?: 'button' | 'div';
  /** Optional children for nested content */
  children?: React.ReactNode;
}

/**
 * SelectableCard - Unified selectable card component
 * Used for sport selection, organization selection, position selection, etc.
 */
export function SelectableCard({
  title,
  subtitle,
  description,
  icon,
  selected = false,
  onSelect,
  disabled = false,
  className,
  as = 'button',
  children,
}: SelectableCardProps) {
  const baseStyles = cn(
    'flex flex-col items-start justify-center rounded-2xl border-2 p-4 transition-all duration-200',
    'hover:border-primary/60 hover:bg-primary/5',
    selected ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-card',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  const content = (
    <>
      {icon && (
        <div className="flex w-full items-center gap-4">
          <div className="shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{title}</div>
            {description && <div className="text-muted-foreground text-sm">{description}</div>}
          </div>
        </div>
      )}
      {!icon && (
        <>
          <div className="font-semibold">{title}</div>
          {subtitle && <div className="text-muted-foreground mt-1 text-xs">{subtitle}</div>}
        </>
      )}
      {children && (
        <div className="mt-4 w-full" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </>
  );

  if (as === 'button') {
    return (
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        className={baseStyles}
        aria-pressed={selected}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      role="button"
      onClick={disabled ? undefined : onSelect}
      className={baseStyles}
      aria-pressed={selected}
      tabIndex={disabled ? -1 : 0}
    >
      {content}
    </div>
  );
}
