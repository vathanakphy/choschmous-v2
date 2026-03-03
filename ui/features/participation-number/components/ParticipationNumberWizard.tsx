'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Building2, Trophy, Hash } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStepWizard } from '@/ui/components/navigation/useStepWizard';
import { WizardShell } from '@/ui/components/navigation/WizardShell';
import {
  useParticipationNumber,
  validateParticipationNumberStep,
} from '../hooks/useParticipationNumber';
import type { ParticipationNumberErrors } from '../types/ParticipationNumber.types';
import { PEventStep } from '../steps/PEventStep';
import { POrgStep } from '../steps/POrgStep';
import { PSportStep } from '../steps/PSportStep';
import { PCountStep } from '../steps/PCountStep';

const ICONS: LucideIcon[] = [Calendar, Building2, Trophy, Hash];
const LABELS = ['ព្រឹត្តិការណ៍', 'ខេត្ត / ស្ថាប័ន', 'ប្រភេទកីឡា', 'ចំនួនប្រតិភូ'];
const STEP_KEYS = ['event', 'organization', 'sport', 'count'];

interface ParticipationNumberWizardProps {
  basePath: string;
}

export function ParticipationNumberWizard({ basePath }: ParticipationNumberWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = searchParams.get('step');
  const initialStep = Math.max(0, STEP_KEYS.indexOf(stepParam ?? ''));

  const { formData, setFields } = useParticipationNumber();
  const [errors, setErrors] = useState<ParticipationNumberErrors>({});

  const steps = LABELS.map((label, i) => ({
    key: STEP_KEYS[i],
    label,
    icon: ICONS[i],
    component: null as any,
  }));

  const handleStepChange = useCallback(
    (index: number) => {
      router.replace(`${basePath}/participation/number?step=${STEP_KEYS[index]}`, {
        scroll: false,
      });
    },
    [router, basePath]
  );

  const wizard = useStepWizard(steps, initialStep, handleStepChange);

  // Guard: if URL has a step > 0 but in-memory state has no eventId, reset to step 0.
  // This handles hard-refresh or direct URL navigation like ?step=organization.
  useEffect(() => {
    const idx = Math.max(0, STEP_KEYS.indexOf(searchParams.get('step') ?? ''));
    if (idx > 0 && !formData.eventId) {
      router.replace(`${basePath}/participation/number`, { scroll: false });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const param = searchParams.get('step');
    const idx = Math.max(0, STEP_KEYS.indexOf(param ?? ''));
    if (idx !== wizard.activeIndex) wizard.goToStep(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const attemptNext = useCallback(
    (override?: Partial<typeof formData>) => {
      const merged = override ? { ...formData, ...override } : formData;
      const errs = validateParticipationNumberStep(wizard.activeIndex, merged);
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      setErrors({});
      wizard.nextStep();
    },
    [wizard, formData]
  );

  const goToStep = useCallback(
    (idx: number) => {
      setErrors({});
      wizard.goToStep(idx);
    },
    [wizard]
  );

  const renderStep = () => {
    switch (wizard.activeIndex) {
      case 0:
        return (
          <PEventStep
            eventId={formData.eventId}
            error={errors.eventId}
            onSelect={(fields) => {
              setFields({ ...fields, organizationId: '', organizationName: '', organizationType: '', sportId: '', sportName: '' });
              attemptNext(fields);
            }}
          />
        );
      case 1:
        return (
          <POrgStep
            eventId={formData.eventId}
            organizationId={formData.organizationId}
            error={errors.organizationId}
            onSelect={(fields) => {
              setFields({ ...fields, sportId: '', sportName: '' });
              attemptNext(fields);
            }}
          />
        );
      case 2:
        return (
          <PSportStep
            eventId={formData.eventId}
            sportId={formData.sportId}
            error={errors.sportId}
            onSelect={(fields) => {
              setFields(fields);
              attemptNext(fields);
            }}
          />
        );
      case 3:
        return <PCountStep formData={formData} setFields={setFields} />;
    }
  };

  const hideNav = wizard.activeIndex === 3;

  return (
    <WizardShell
      sidebar={null}
      activeIndex={wizard.activeIndex}
      errors={errors}
      hideNav={hideNav}
      onPrev={wizard.prevStep}
      onNext={() => attemptNext()}
      prevDisabled={wizard.activeIndex === 0}
      className="min-h-[80vh]"
      contentClassName="max-w-4xl mx-auto"
    >
      {renderStep()}
    </WizardShell>
  );
}
