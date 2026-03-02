import { PortalLayoutShell } from '@/ui/components/layout/PortalLayoutShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayoutShell mode="admin">{children}</PortalLayoutShell>;
}
