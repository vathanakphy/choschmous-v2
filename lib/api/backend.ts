/**
 * Shared helpers for proxying requests to the FastAPI backend.
 * Every API route can `import { backendFetch, backendList } from '@/lib/api/backend'`.
 */

const BACKEND_URL = (process.env.BACKEND_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(
  /\/+$/,
  ''
);
const API = `${BACKEND_URL}/api`;

export type ListResponse<T> = { data?: T[]; count?: number };

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(30000), ...init });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Backend ${res.status}: ${body}`);
  }
  return (await res.json()) as T;
}

export async function backendList<T>(
  path: string,
  limit = 200,
  skip = 0
): Promise<ListResponse<T>> {
  const sep = path.includes('?') ? '&' : '?';
  return backendFetch<ListResponse<T>>(`${path}${sep}skip=${skip}&limit=${limit}`);
}

export async function backendPost<T>(path: string, body: unknown): Promise<T> {
  return backendFetch<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function backendPatch<T>(path: string, body: unknown): Promise<T> {
  return backendFetch<T>(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function backendDelete(path: string): Promise<void> {
  await backendFetch<unknown>(path, { method: 'DELETE' });
}

export { API, BACKEND_URL };
