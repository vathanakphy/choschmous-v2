'use client';

import { PortalSidebar } from './PortalSidebar';
import { PortalTopbar } from './PortalTopbar';

interface PortalLayoutShellProps {
  mode: 'admin' | 'superadmin';
  children: React.ReactNode;
}

export function PortalLayoutShell({ mode, children }: PortalLayoutShellProps) {
  return (
    <div className="bg-background flex min-h-screen w-full">
      <PortalSidebar mode={mode} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalTopbar mode={mode} />
        <main className="bg-background flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
