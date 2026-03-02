'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

function NativeSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        'border-input bg-background focus:ring-ring h-10 w-full rounded-lg border px-3 text-sm shadow-xs transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { NativeSelect };
