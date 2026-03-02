'use client';

import { useEffect, useState } from 'react';

/**
 * Generic hook for fetching a list from an API endpoint.
 *
 * Handles loading, error, and abort-on-unmount automatically.
 *
 * @example
 * const { data: events, loading, error } = useFetchList('/api/events?limit=100', mapEvent);
 */
export function useFetchList<T>(
  url: string | null,
  mapFn: (raw: any) => T,
  deps: any[] = []
): { data: T[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        const raw: any[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
        setData(raw.map(mapFn));
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('មិនអាចទាញទិន្នន័យបាន');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return { data, loading, error };
}
