import { Suspense } from 'react';
import { ParticipationNumberWizard } from '@/ui/features/participation-number';

export default function SuperadminParticipationNumberPage() {
  return (
    <Suspense>
      <ParticipationNumberWizard basePath="/superadmin" />
    </Suspense>
  );
}
