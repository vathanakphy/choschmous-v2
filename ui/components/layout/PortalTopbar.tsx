'use client';

import { Search, Bell } from 'lucide-react';
import { Input } from '@/ui/design-system/primitives/Input';

interface PortalTopbarProps {
  mode: 'admin' | 'superadmin';
}

export function PortalTopbar({ mode }: PortalTopbarProps) {
  const displayRole = mode === 'superadmin' ? 'Superadmin' : 'Admin';
  const initials = mode === 'superadmin' ? 'S' : 'A';

  return (
    <header className="bg-card sticky top-0 z-20 flex h-16 items-center justify-between border-b px-8">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="ស្វែងរក..." className="bg-accent h-10 rounded-xl border-none pl-10" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="hover:bg-accent relative rounded-full p-2 transition-colors">
          <Bell className="text-muted-foreground h-5 w-5" />
          <span className="bg-destructive absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[10px] text-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold">{displayRole}</p>
            <p className="text-muted-foreground text-[10px]">{displayRole}</p>
          </div>
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
