// features/dashboard/hooks/useDashboardData.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';
import type { DashboardPayload } from '../types/Dashboard.types';

const EMPTY: DashboardPayload = {
  stats: { events: 0, sports: 0, participants: 0, registrations: 0, organizations: 0, athletes: 0, leaders: 0 },
  events: [],
  sports: [],
  topOrganizations: [],
  recentEnrollments: [],
  genderDistribution: { male: 0, female: 0, other: 0 },
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardPayload>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(ROUTES.API.DASHBOARD, {
        cache: 'no-store',
        credentials: 'include',
      });

      const json = (await res.json()) as ApiResponse<DashboardPayload>;

      if (!res.ok || !json.success) {
        // FIX: Original code had the ternary backwards:
        // `json.success ? 'Failed...' : json.error` means when success=false
        // it threw json.error which could be undefined → "undefined" error message
        throw new Error(
          !json.success
            ? ((json as { error?: string }).error ?? 'Failed to load dashboard')
            : `HTTP ${res.status}`
        );
      }

      setData({
        ...EMPTY,
        ...json.data,
        stats: { ...EMPTY.stats, ...json.data.stats },
        genderDistribution: { ...EMPTY.genderDistribution, ...(json.data.genderDistribution ?? {}) },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      setData(EMPTY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, isLoading, error, reload: load };
}