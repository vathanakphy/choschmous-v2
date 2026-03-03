import { Suspense } from 'react';
import { ParticipationNumberWizard } from '@/ui/features/participation-number';

export default function AdminParticipationNumberPage() {
  return (
    <Suspense>
      <ParticipationNumberWizard basePath="/admin" />
    </Suspense>
  );
}
