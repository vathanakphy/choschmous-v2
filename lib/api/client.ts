import type { ApiResponse } from '@/types/api';
type Opts = Omit<RequestInit, 'body'> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
};

async function request<T>(url: string, options: Opts = {}): Promise<ApiResponse<T>> {
  const { body, params, ...init } = options;
  let fullUrl = url;
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    );
    if (qs.toString()) fullUrl += `?${qs}`;
  }
  const res = await fetch(fullUrl, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 204) { //handle delete success with no content
    return { success: true, data: null as unknown as T, meta: {} };
  }

  return res.json() as Promise<ApiResponse<T>>;
}

export const apiClient = {
  get: <T>(url: string, params?: Opts['params']) => request<T>(url, { method: 'GET', params }),
  post: <T>(url: string, body: unknown) => request<T>(url, { method: 'POST', body }),
  put: <T>(url: string, body: unknown) => request<T>(url, { method: 'PUT', body }),
  patch: <T>(url: string, body: unknown) => request<T>(url, { method: 'PATCH', body }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
