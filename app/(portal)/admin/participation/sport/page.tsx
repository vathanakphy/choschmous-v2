import { Suspense } from 'react';
import { ParticipationSportPage } from '@/ui/features/participation-sport/ParticipationSportPage';

export default function AdminParticipationSportPage() {
  return (
    <Suspense>
      <ParticipationSportPage />
    </Suspense>
  );
}
