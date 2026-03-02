import * as React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Container({ as: Comp = 'div', className, ...props }: ContainerProps) {
  return <Comp className={cn('mx-auto w-full max-w-7xl px-6', className)} {...props} />;
}
