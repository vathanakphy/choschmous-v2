'use client';

import { ROUTES } from '@/config/routes';
import { useDashboardData } from '../hooks/useDashboardData';
import { HeroBanner } from './HeroBanner';
import { StatsSection } from './StatsSection';
import { EventsPanel } from './EventsPanel';
import { SportsPanel } from './SportsPanel';
import { OrganizationsPanel } from './OrganizationsPanel';
import { RecentEnrollments } from './RecentEnrollments';
import { GenderChart } from './GenderChart';
import { QuickActionsPanel } from './QuickActionsPanel';
import { PortalModules } from './PortalModules';
import { DashboardSkeleton } from './DashboardSkeleton';

type DashboardPageProps = {
  role: 'admin' | 'superadmin';
};

export function DashboardPage({ role }: DashboardPageProps) {
  const { data, isLoading, error, reload } = useDashboardData();
  const routes = role === 'superadmin' ? ROUTES.SUPERADMIN : ROUTES.ADMIN;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* ── Hero Banner ── */}
      <HeroBanner role={role} isLoading={isLoading} onRefresh={reload} />

      {/* ── Error Alert ── */}
      {error && (
        <div className="border-destructive/40 bg-destructive/10 rounded-xl border px-5 py-4">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ── Stats Grid ── */}
      <StatsSection stats={data.stats} isLoading={isLoading} />

      {/* ── Events & Sports ── */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <EventsPanel
          events={data.events}
          isLoading={isLoading}
          eventsRoute={routes.EVENTS}
          eventRoute={routes.EVENT}
        />
        <SportsPanel
          sports={data.sports}
          isLoading={isLoading}
          sportsRoute={routes.SPORTS}
          sportRoute={routes.SPORT}
        />
      </section>

      {/* ── Organizations, Gender, Quick Actions ── */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <OrganizationsPanel organizations={data.topOrganizations} isLoading={isLoading} />
        <GenderChart distribution={data.genderDistribution} isLoading={isLoading} />
        <QuickActionsPanel routes={routes} />
      </section>

      {/* ── Recent Enrollments ── */}
      <RecentEnrollments enrollments={data.recentEnrollments} isLoading={isLoading} />

      {/* ── Portal Modules ── */}
      <PortalModules routes={routes} />
    </div>
  );
}
