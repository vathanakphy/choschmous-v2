/**
 * Shared Form Components
 * Reusable form elements to reduce duplication across the app
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * FormError - Consistent error message display
 */
interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;
  return (
    <p className={cn('text-destructive mt-1 text-xs', className)} role="alert">
      {message}
    </p>
  );
}

/**
 * SectionTitle - Consistent section headers
 * Replaces duplicate: <h2 className="text-3xl font-bold text-center">...</h2>
 */
interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionTitle({
  children,
  subtitle,
  className,
  centered = true,
}: SectionTitleProps) {
  return (
    <div className={cn('space-y-2', centered && 'text-center', className)}>
      <h2 className="text-foreground text-2xl font-bold tracking-tight">{children}</h2>
      {subtitle && <p className="text-muted-foreground text-base">{subtitle}</p>}
    </div>
  );
}

/**
 * FormField - Wrapper for form inputs with label and error
 */
interface FormFieldProps {
  label?: string;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-foreground text-sm leading-none font-medium">
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      <FormError message={error} />
    </div>
  );
}

/**
 * InputWithError - Input field with integrated error display
 */
interface InputWithErrorProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
}

export const InputWithError = React.forwardRef<HTMLInputElement, InputWithErrorProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          ref={ref}
          className={cn(
            'border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-lg border px-3 py-2 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            className
          )}
          {...props}
        />
        <FormError message={error} />
      </div>
    );
  }
);
InputWithError.displayName = 'InputWithError';
