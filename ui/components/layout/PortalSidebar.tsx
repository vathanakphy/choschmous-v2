'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  MapPin,
  Settings,
  Building2,
  ClipboardList,
  Medal,
  BarChart3,
  Link2,
  Grid3X3,
  UserCog,
  Hash,
  Swords,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/config/routes';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const ADMIN_NAV: NavItem[] = [
  {
    label: 'ផ្ទាំងគ្រប់គ្រង',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: ROUTES.ADMIN.ROOT,
  },
  { label: 'ព្រឹត្តិការណ៍', icon: <Calendar className="h-5 w-5" />, href: ROUTES.ADMIN.EVENTS },
  { label: 'កីឡា', icon: <Trophy className="h-5 w-5" />, href: ROUTES.ADMIN.SPORTS },
  { label: 'អ្នកចូលរួម', icon: <Users className="h-5 w-5" />, href: ROUTES.ADMIN.PARTICIPANTS },
  { label: 'ខេត្ត', icon: <MapPin className="h-5 w-5" />, href: ROUTES.ADMIN.PROVINCES },
  { label: 'ស្ទង់មតិ', icon: <ClipboardList className="h-5 w-5" />, href: ROUTES.ADMIN.SURVEY },
  {
    label: 'បញ្ជីចំនួនប្រតិភូ',
    icon: <Hash className="h-5 w-5" />,
    href: ROUTES.ADMIN.PARTICIPATION_NUMBER,
  },
  {
    label: 'បញ្ជីកីឡាប្រកួត',
    icon: <Swords className="h-5 w-5" />,
    href: ROUTES.ADMIN.PARTICIPATION_SPORT,
  },
];

const SUPERADMIN_NAV: NavItem[] = [
  {
    label: 'ផ្ទាំងគ្រប់គ្រង',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.DASHBOARD,
  },
  {
    label: 'ព្រឹត្តិការណ៍',
    icon: <Calendar className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.EVENTS,
  },
  { label: 'កីឡា', icon: <Trophy className="h-5 w-5" />, href: ROUTES.SUPERADMIN.SPORTS },
  { label: 'ប្រភេទ', icon: <Grid3X3 className="h-5 w-5" />, href: ROUTES.SUPERADMIN.CATEGORIES },
  {
    label: 'អ្នកចូលរួម',
    icon: <Users className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.PARTICIPANTS,
  },
  { label: 'ខេត្ត', icon: <MapPin className="h-5 w-5" />, href: ROUTES.SUPERADMIN.PROVINCES },
  {
    label: 'ស្ថាប័ន',
    icon: <Building2 className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.ORGANIZATIONS,
  },
  {
    label: 'ការកំណត់កីឡា',
    icon: <Link2 className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.ASSIGNMENTS,
  },
  { label: 'មេដាយ', icon: <Medal className="h-5 w-5" />, href: ROUTES.SUPERADMIN.MEDALS },
  {
    label: 'តារាងចំណាត់ថ្នាក់',
    icon: <BarChart3 className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.LEADERBOARD,
  },
  {
    label: 'អ្នកប្រើប្រាស់',
    icon: <UserCog className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.SESSIONS,
  },
  {
    label: 'ស្ទង់មតិ',
    icon: <ClipboardList className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.SURVEY,
  },
  {
    label: 'បញ្ជីចំនួនប្រតិភូ',
    icon: <Hash className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.PARTICIPATION_NUMBER,
  },
  {
    label: 'បញ្ជីកីឡាប្រកួត',
    icon: <Swords className="h-5 w-5" />,
    href: ROUTES.SUPERADMIN.PARTICIPATION_SPORT,
  },
];

interface PortalSidebarProps {
  mode: 'admin' | 'superadmin';
}

export function PortalSidebar({ mode }: PortalSidebarProps) {
  const pathname = usePathname();
  const items = mode === 'superadmin' ? SUPERADMIN_NAV : ADMIN_NAV;
  const base = mode === 'superadmin' ? '/superadmin' : '/admin';
  const displayRole = mode === 'superadmin' ? 'Superadmin' : 'Admin';

  return (
    <aside className="bg-sidebar text-sidebar-foreground sticky top-0 flex h-screen w-64 flex-col">
      {/* Logo */}
      <div className="border-sidebar-border flex h-16 items-center gap-3 border-b px-6">
        <div className="bg-sidebar-primary flex h-10 w-10 items-center justify-center rounded-lg">
          <Trophy className="text-sidebar-primary-foreground h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Choschmous</h1>
          <p className="text-sidebar-foreground/60 text-xs">{displayRole}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== base && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-sidebar-border border-t p-4">
        <Link
          href={`${base}?view=settings`}
          className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
          <span>ការកំណត់</span>
        </Link>
      </div>
    </aside>
  );
}
