import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  className?: string;
  text?: string;
}

export function Logo({ href = '/', className, text = 'ChosChmous' }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn('text-foreground text-lg font-semibold tracking-tight', className)}
    >
      {text}
    </Link>
  );
}
