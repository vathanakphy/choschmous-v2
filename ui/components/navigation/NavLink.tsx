'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
}

export function NavLink({ href, children, className, exact = true }: NavLinkProps) {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors',
        isActive
          ? 'text-foreground border-foreground border-b-2 pb-1'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {children}
    </Link>
  );
}
