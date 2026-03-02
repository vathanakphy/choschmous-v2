/**
 * ui/design-system/primitives/SelectionPill.tsx
 *
 * WHAT: Pill-shaped toggle button for single-select lists (events, sports, orgs, categories).
 *       Supports color variants and shows a checkmark when selected.
 *
 * HOW TO USE:
 *
 *   import { SelectionPill } from '@/ui/design-system/primitives/SelectionPill'
 *
 *   <SelectionPill
 *     label="បាល់ទាត់"
 *     isSelected={selected === 'soccer'}
 *     onClick={() => setSelected('soccer')}
 *     variant="indigo"   // 'indigo' | 'purple' | 'emerald'
 *     size="default"     // 'default' | 'sm'
 *   />
 *
 *   // In a grid of options:
 *   <div className="grid grid-cols-3 gap-3">
 *     {sports.map(s => (
 *       <SelectionPill key={s.id} label={s.name}
 *         isSelected={formData.sportId === s.id}
 *         onClick={() => setFields({ sportId: s.id })}
 *         variant="indigo" />
 *     ))}
 *   </div>
 */

'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const VARIANTS = {
  indigo: {
    base: 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5',
    selected: 'border-primary bg-primary text-primary-foreground',
  },
  purple: {
    base: 'border-border bg-card text-foreground hover:border-(--reg-purple-600)/40 hover:bg-(--reg-purple-50)',
    selected: 'border-(--reg-purple-600) bg-(--reg-purple-600) text-primary-foreground',
  },
  emerald: {
    base: 'border-border bg-card text-foreground hover:border-(--reg-emerald-600)/40 hover:bg-(--reg-emerald-50)',
    selected: 'border-(--reg-emerald-600) bg-(--reg-emerald-600) text-primary-foreground',
  },
} as const;

export interface SelectionPillProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  variant?: keyof typeof VARIANTS;
  size?: 'default' | 'sm';
  className?: string;
  disabled?: boolean;
}

export function SelectionPill({
  label,
  isSelected,
  onClick,
  variant = 'indigo',
  size = 'default',
  className,
  disabled,
}: SelectionPillProps) {
  const v = VARIANTS[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-full border font-medium transition-all duration-150',
        size === 'default' ? 'px-4 py-2.5 text-sm' : 'px-3 py-2 text-xs',
        isSelected ? v.selected : v.base,
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <span>{label}</span>
      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
    </button>
  );
}
