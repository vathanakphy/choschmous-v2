// ui/hooks/usePagedList.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiResponse } from '@/types/api';

export function usePagedList<T>(
  baseUrl: string,
  opts: { pageSize?: number; extraParams?: Record<string, string> } = {}
) {
  const { pageSize = 20 } = opts;

  // FIX 1: Serialize extraParams to a stable string so it can safely be
  // a useCallback dep without causing infinite re-renders when passed inline
  const extraParamsStr = opts.extraParams
    ? new URLSearchParams(opts.extraParams).toString()
    : '';

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        ...(search ? { search } : {}),
      });

      // Re-inflate extraParams from the stable string
      if (extraParamsStr) {
        new URLSearchParams(extraParamsStr).forEach((v, k) => params.set(k, v));
      }

      // FIX 2: Include credentials so auth cookies are sent
      const res = await fetch(`${baseUrl}?${params}`, {
        signal: ctrl.signal,
        cache: 'no-store',
        credentials: 'include',
      });

      const json = (await res.json()) as ApiResponse<T[]>;

      if (!res.ok || !json.success) {
        throw new Error(!json.success ? (json as { error?: string }).error : `HTTP ${res.status}`);
      }

      setData(json.data);
      setTotal(json.meta?.total ?? json.data.length);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'មិនអាចទាញទិន្នន័យបាន');
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, page, pageSize, search, extraParamsStr]); // stable string dep

  useEffect(() => {
    void load();
    return () => abortRef.current?.abort();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    data,
    total,
    page,
    totalPages,
    pageSize,
    search,
    isLoading,
    error,
    setPage,
    setSearch: (v: string) => {
      setSearch(v);
      setPage(1);
    },
    reload: load,
  };
}