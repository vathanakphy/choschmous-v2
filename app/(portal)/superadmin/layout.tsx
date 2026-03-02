import { PortalLayoutShell } from '@/ui/components/layout/PortalLayoutShell';

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayoutShell mode="superadmin">{children}</PortalLayoutShell>;
}
