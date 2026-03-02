'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { Button } from '@/ui/design-system/primitives/Button';

const navLinks = [
  { label: 'Register', href: ROUTES.PUBLIC.REGISTER.event },
  { label: 'Survey', href: ROUTES.PUBLIC.SURVEY },
  { label: 'By Number', href: ROUTES.PUBLIC.BYNUMBER },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-border bg-card/95 supports-backdrop-filter:bg-card/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link href="/" className="text-primary text-xl font-extrabold tracking-tight">
          Choschmous
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button size="sm" className="rounded-[0.75rem] px-6" asChild>
            <Link href={ROUTES.AUTH.LOGIN}>Login</Link>
          </Button>
        </nav>

        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-border bg-card border-t px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground py-2 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button size="sm" className="mt-2 w-full rounded-[0.75rem]" asChild>
              <Link href={ROUTES.AUTH.LOGIN}>Login</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
