'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiResponse } from '@/types/api';

/**
 * Generic hook for client-side paginated list with search.
 *
 * Calls Next.js API routes (which proxy to FastAPI).
 * Expects the API to return `{ success: true, data: T[], meta?: { total } }`.
 *
 * @example
 * const list = usePagedList<Event>('/api/events');
 */
export function usePagedList<T>(
  baseUrl: string,
  opts: { pageSize?: number; extraParams?: Record<string, string> } = {}
) {
  const { pageSize = 20, extraParams } = opts;

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
        ...(extraParams ?? {}),
      });

      const res = await fetch(`${baseUrl}?${params}`, {
        signal: ctrl.signal,
        cache: 'no-store',
      });

      const json = (await res.json()) as ApiResponse<T[]>;

      if (!res.ok || !json.success) {
        throw new Error(!json.success ? json.error : `HTTP ${res.status}`);
      }

      setData(json.data);
      setTotal(json.meta?.total ?? json.data.length);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'មិនអាចទាញទិន្នន័យបាន');
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, page, pageSize, search, extraParams]);

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
