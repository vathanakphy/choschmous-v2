import { Badge } from '@/ui/design-system/primitives/Badge';
type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | 'active' | 'inactive' | string;
const MAP: Record<
  string,
  { label: string; variant: 'default' | 'success' | 'destructive' | 'warning' | 'secondary' }
> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
};
export function StatusBadge({ status }: { status: Status }) {
  const c = MAP[status] ?? { label: status, variant: 'secondary' as const };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
