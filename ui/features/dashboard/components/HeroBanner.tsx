'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/ui/design-system/primitives/Button';

type HeroBannerProps = {
  role: 'admin' | 'superadmin';
  isLoading: boolean;
  onRefresh: () => void;
};

export function HeroBanner({ role, isLoading, onRefresh }: HeroBannerProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="border-primary/15 from-primary to-primary/70 text-primary-foreground relative overflow-hidden rounded-3xl border bg-linear-to-br p-8 shadow-xl">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-10 -right-8 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute right-12 bottom-6 h-24 w-24 rounded-full bg-white/5 blur-xl" />

      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-primary-foreground/80 text-xs font-semibold tracking-[0.2em] uppercase">
            {role === 'superadmin' ? 'ប្រព័ន្ធគ្រប់គ្រងកណ្ដាល' : 'កន្លែងធ្វើការអ្នកគ្រប់គ្រង'}
          </p>
          <h1 className="mt-2 text-3xl font-bold">ផ្ទាំងគ្រប់គ្រង</h1>
          <p className="text-primary-foreground/85 mt-2 max-w-2xl text-sm">
            ទិដ្ឋភាពទូទៅនៃព្រឹត្តិការណ៍ កីឡា អ្នកចូលរួម និងការចុះឈ្មោះ ដែលធ្វើសមកាលកម្មពី Backend
            APIs។
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="text-primary-foreground hover:text-primary-foreground border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            ផ្ទុកឡើងវិញ
          </Button>

          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-right backdrop-blur-sm">
            <p className="text-primary-foreground/75 text-xs tracking-wide uppercase">ថ្ងៃនេះ</p>
            <p className="mt-1 text-sm font-medium">{today}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
