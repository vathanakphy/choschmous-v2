// ui/hooks/useUserSession.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { SessionData } from '@/infrastructure/session/session.service';
import { ROUTES } from '@/config/routes';

interface UseUserSessionReturn {
  session: SessionData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // FIX 1: Expose reload so pages can re-check session after login
  reload: () => void;
}

export function useUserSession(): UseUserSessionReturn {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async (signal: AbortSignal) => {
    // FIX 2: Reset loading true on each call (important for reload())
    setIsLoading(true);
    try {
      const response = await fetch(ROUTES.API.SESSION, {
        signal,
        credentials: 'include',
      });

      if (!response.ok) {
        setSession(null);
        return;
      }

      const result = await response.json();
      setSession(result?.success ? result.data : null);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setSession(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadSession(controller.signal);
    return () => controller.abort();
  }, [loadSession]);

  const reload = useCallback(() => {
    const controller = new AbortController();
    void loadSession(controller.signal);
  }, [loadSession]);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    reload,
  };
}