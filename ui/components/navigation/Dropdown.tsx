'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Dropdown({ trigger, children, className }: DropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

      {open && (
        <div
          className={cn(
            'bg-card absolute right-0 z-50 mt-3 flex w-52 flex-col gap-3 rounded-2xl border p-4 shadow-lg',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
