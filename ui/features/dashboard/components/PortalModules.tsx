'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Medal,
  Users,
  MapPinned,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react';

type PortalModulesProps = {
  routes: {
    ROOT: string;
    EVENTS: string;
    SPORTS: string;
    PARTICIPANTS: string;
    PROVINCES: string;
    SURVEY: string;
  };
};

const MODULES = [
  {
    key: 'ROOT',
    label: 'ផ្ទាំងគ្រប់គ្រង',
    helper: 'ទិដ្ឋភាពទូទៅនិងរបាយការណ៍',
    icon: LayoutDashboard,
  },
  {
    key: 'EVENTS',
    label: 'ព្រឹត្តិការណ៍',
    helper: 'គ្រប់គ្រងព្រឹត្តិការណ៍ប្រកួត',
    icon: CalendarDays,
  },
  { key: 'SPORTS', label: 'កីឡា', helper: 'គ្រប់គ្រងបញ្ជីកីឡា', icon: Medal },
  { key: 'PARTICIPANTS', label: 'អ្នកចូលរួម', helper: 'ពិនិត្យកំណត់ត្រាអ្នកចូលរួម', icon: Users },
  { key: 'PROVINCES', label: 'ខេត្ត', helper: 'រុករកតាមតំបន់ស្ថាប័ន', icon: MapPinned },
  { key: 'SURVEY', label: 'ស្ទង់មតិ', helper: 'លំហូរស្ទង់មតិនិងទទួលព័ត៌មាន', icon: ClipboardList },
];

export function PortalModules({ routes }: PortalModulesProps) {
  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">ម៉ូឌុលវិបផតថល</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const href = routes[mod.key as keyof typeof routes];
          return (
            <Link
              key={mod.key}
              href={href}
              className="group bg-background hover:bg-muted/40 flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <div className="bg-primary/8 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-semibold">{mod.label}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{mod.helper}</p>
                <p className="text-primary mt-2 inline-flex items-center gap-1 text-xs font-medium">
                  បើក
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
