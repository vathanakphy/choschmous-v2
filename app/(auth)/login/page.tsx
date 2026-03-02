'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import { apiClient } from '@/lib/api/client';
import type { AuthUser } from '@/domains/auth/auth.types';
import { Role } from '@/config/roles';
import { Input } from '@/ui/design-system/primitives/Input';
import { Button } from '@/ui/design-system/primitives/Button';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await apiClient.post<AuthUser>(ROUTES.API.LOGIN, form);
      if (!result.success) {
        setError(result.error ?? 'Login failed');
        return;
      }
      // Redirect based on role
      const role = result.data.role;
      if (role === Role.SUPERADMIN) router.push(ROUTES.SUPERADMIN.ROOT);
      else router.push(ROUTES.ADMIN.ROOT);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card w-full max-w-md rounded-2xl border p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mb-6 text-sm">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <Input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="your_username"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
