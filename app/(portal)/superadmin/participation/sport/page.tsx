import { Suspense } from 'react';
import { ParticipationSportPage } from '@/ui/features/participation-sport/ParticipationSportPage';

export default function SuperadminParticipationSportPage() {
  return (
    <Suspense>
      <ParticipationSportPage />
    </Suspense>
  );
}
