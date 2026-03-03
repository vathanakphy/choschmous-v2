'use client';

import { useEffect, useRef, useState } from 'react';

export function useFetchList<T>(
  url: string | null,
  mapFn: (raw: unknown) => T,
): { data: T[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState<string | null>(null);

  const mapFnRef = useRef(mapFn);
  useEffect(() => {
    mapFnRef.current = mapFn;
  }, [mapFn]);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();

    fetch(url, {
      signal: controller.signal,
      credentials: 'include',
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: unknown) => {
        const raw = Array.isArray((json as { data?: unknown })?.data)
          ? (json as { data: unknown[] }).data
          : Array.isArray(json)
            ? (json as unknown[])
            : [];
        try {
          setData(raw.map((item) => mapFnRef.current(item)));
        } catch {
          setError('មិនអាចដំណើរការទិន្នន័យបាន');
        }
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError('មិនអាចទាញទិន្នន័យបាន');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}