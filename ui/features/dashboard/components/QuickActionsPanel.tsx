'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Medal,
  Users,
  MapPinned,
  ClipboardList,
  Trophy,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/ui/design-system/primitives/Button';

type QuickActionsPanelProps = {
  routes: {
    ROOT: string;
    EVENTS: string;
    SPORTS: string;
    PARTICIPANTS: string;
    PROVINCES: string;
    SURVEY: string;
  };
};

const ICON_MAP: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard className="h-4 w-4" />,
  Events: <CalendarDays className="h-4 w-4" />,
  Sports: <Medal className="h-4 w-4" />,
  Participants: <Users className="h-4 w-4" />,
  Provinces: <MapPinned className="h-4 w-4" />,
  Survey: <ClipboardList className="h-4 w-4" />,
};

export function QuickActionsPanel({ routes }: QuickActionsPanelProps) {
  const actions = [
    { label: 'គ្រប់គ្រងព្រឹត្តិការណ៍', href: routes.EVENTS, icon: 'Events' },
    { label: 'គ្រប់គ្រងកីឡា', href: routes.SPORTS, icon: 'Sports' },
    { label: 'មើលអ្នកចូលរួម', href: routes.PARTICIPANTS, icon: 'Participants' },
    { label: 'បើកខេត្ត', href: routes.PROVINCES, icon: 'Provinces' },
    { label: 'បើកស្ទង់មតិ', href: routes.SURVEY, icon: 'Survey' },
  ];

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          <Trophy className="text-primary h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold">សកម្មភាពរហ័ស</h2>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {actions.map((action) => (
          <Button
            key={action.href}
            asChild
            variant="outline"
            className="hover:bg-muted/40 justify-between"
          >
            <Link href={action.href}>
              <span className="flex items-center gap-2">
                {ICON_MAP[action.icon]}
                {action.label}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
