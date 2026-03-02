import { cn } from '@/lib/utils';
interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}
export function StatCard({ label, value, description, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('bg-card rounded-2xl border p-6 shadow-sm', className)}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="text-foreground text-3xl font-bold">{value}</p>
      {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
      {trend && (
        <p
          className={cn(
            'mt-2 text-xs font-medium',
            trend.value >= 0 ? 'text-chart-2' : 'text-destructive'
          )}
        >
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}
