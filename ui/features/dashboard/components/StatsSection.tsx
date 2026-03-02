'use client';

import { CalendarDays, Medal, Users, UserRound, Building2, UserCheck, Shield } from 'lucide-react';
import { StatCard } from '@/ui/components/data-display/StatCard';
import type { DashboardStats } from '../types/Dashboard.types';

type StatsSectionProps = {
  stats: DashboardStats;
  isLoading: boolean;
};

export function StatsSection({ stats, isLoading }: StatsSectionProps) {
  const placeholder = isLoading ? '...' : 0;

  const cards = [
    {
      label: 'ព្រឹត្តិការណ៍',
      value: isLoading ? '...' : stats.events,
      description: 'ព្រឹត្តិការណ៍សរុប',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      label: 'កីឡា',
      value: isLoading ? '...' : stats.sports,
      description: 'ប្រភេទកីឡា',
      icon: <Medal className="h-5 w-5" />,
    },
    {
      label: 'អ្នកចូលរួម',
      value: isLoading ? '...' : stats.participants,
      description: 'កីឡាករ + អ្នកដឹកនាំ',
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: 'ការចុះឈ្មោះ',
      value: isLoading ? '...' : stats.registrations,
      description: 'កំណត់ត្រាចុះឈ្មោះ',
      icon: <UserRound className="h-5 w-5" />,
    },
    {
      label: 'ស្ថាប័ន',
      value: isLoading ? '...' : stats.organizations,
      description: 'ស្ថាប័នដែលបានចុះបញ្ជី',
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: 'កីឡាករ',
      value: isLoading ? '...' : stats.athletes,
      description: 'កីឡាករសរុប',
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      label: 'អ្នកដឹកនាំ',
      value: isLoading ? '...' : stats.leaders,
      description: 'អ្នកដឹកនាំសរុប',
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((c) => (
        <StatCard key={c.label} {...c} />
      ))}
    </section>
  );
}
