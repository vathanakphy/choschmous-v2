'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Building2, TableProperties, CheckCircle2, PartyPopper } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStepWizard } from '@/ui/components/navigation/useStepWizard';
import { WizardShell } from '@/ui/components/navigation/WizardShell';
import { ByNumberSidebar } from './ByNumberSidebar';
import { useByNumber, validateByNumberStep } from '../hooks/useByNumber';
import type { ByNumberErrors } from '../types/ByNumber.types';
// Step components — reuse registration steps where possible
import { EventStep } from '@/ui/features/registrations/components/steps/Eventstep';
import { OrganizationStep } from '@/ui/features/registrations/components/steps/Organizationstep';
import { SportTableStep } from './steps/SportTableStep';
import { ConfirmByNumberStep } from './steps/ConfirmByNumberStep';
import { CompletedByNumberStep } from './steps/CompletedByNumberStep';

interface Event {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  sports?: any[];
  type?: string;
}

const ICONS: LucideIcon[] = [Calendar, Building2, TableProperties, CheckCircle2, PartyPopper];
const LABELS = ['ព្រឹត្តិការណ៍', 'អង្គភាព', 'កីឡា', 'បញ្ជាក់', 'បញ្ចប់'];
const STEP_KEYS = ['event', 'organization', 'sports', 'confirmation', 'completed'];
const STEP_ROUTES = STEP_KEYS.map((k) => `/bynumber?step=${k}`);

export function ByNumberWizard({
  events,
  eventsLoading,
}: {
  events: Event[];
  eventsLoading?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = searchParams.get('step');
  const initialStep = stepParam ? Math.max(STEP_KEYS.indexOf(stepParam), 0) : 0;

  const { formData, setFields, reset, initSports, setCount } = useByNumber();
  const [errors, setErrors] = useState<ByNumberErrors>({});

  const steps = LABELS.map((label, i) => ({
    key: STEP_KEYS[i],
    label,
    icon: ICONS[i],
    component: null as any,
  }));

  const handleStepChange = useCallback(
    (index: number) => {
      router.replace(STEP_ROUTES[index], { scroll: false });
    },
    [router]
  );

  const wizard = useStepWizard(steps, initialStep, handleStepChange);

  useEffect(() => {
    const param = searchParams.get('step');
    const idx = param ? STEP_KEYS.indexOf(param) : 0;
    if (idx !== -1 && idx !== wizard.activeIndex) {
      wizard.goToStep(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const attemptNext = useCallback(
    (override?: Partial<typeof formData>) => {
      const merged = override ? { ...formData, ...override } : formData;
      const errs = validateByNumberStep(wizard.activeIndex, merged);
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

  // Adapt formData to match StepProps shape expected by reused steps
  const registrationFormData = {
    eventId: formData.eventId,
    eventName: formData.eventName,
    organizationId: formData.organizationId,
    organizationName: formData.organizationName,
    organizationType: formData.organizationType,
    // Unused fields — required by StepProps type
    sportId: '',
    sportName: '',
    categoryId: '',
    categoryName: '',
    firstNameKhmer: '',
    lastNameKhmer: '',
    firstNameLatin: '',
    lastNameLatin: '',
    fullNameKhmer: '',
    fullNameEnglish: '',
    gender: '' as const,
    dateOfBirth: '',
    nationality: '',
    nationalID: '',
    phone: '',
    idDocType: '' as const,
    selectedDocKeys: '',
    role: '' as const,
    leaderRole: '' as const,
    athleteCategory: '' as const,
    photoUpload: null,
    nationalityDocumentUpload: null,
    docBirthCertificate: null,
    docNationalId: null,
    docPassport: null,
  };

  const registrationErrors = {
    eventId: errors.eventId,
    organizationId: errors.organizationId,
  };

  const renderStep = () => {
    switch (wizard.activeIndex) {
      case 0:
        return (
          <EventStep
            formData={registrationFormData}
            setFields={(fields) => setFields(fields as any)}
            errors={registrationErrors}
            onNext={(fields?: any) => attemptNext(fields)}
            events={events}
            loading={eventsLoading}
          />
        );
      case 1:
        return (
          <OrganizationStep
            formData={registrationFormData}
            setFields={(fields) => setFields(fields as any)}
            errors={registrationErrors}
            onNext={(fields?: any) => attemptNext(fields)}
          />
        );
      case 2:
        return (
          <SportTableStep
            formData={formData}
            errors={errors}
            setCount={setCount}
            initSports={initSports}
          />
        );
      case 3:
        return (
          <ConfirmByNumberStep
            formData={formData}
            onEdit={goToStep}
            onSuccess={() => wizard.nextStep()}
          />
        );
      case 4:
        return <CompletedByNumberStep formData={formData} onGoHome={() => router.push('/')} />;
    }
  };

  // Steps 3 (confirmation) and 4 (completed) have their own nav buttons
  const hideNav = wizard.activeIndex >= 3;

  return (
    <WizardShell
      sidebar={
        <ByNumberSidebar
        steps={wizard.stepsWithState.map((s, i) => ({
          ...s,
          icon: ICONS[i],
        }))}
        activeIndex={wizard.activeIndex}
        gotoStep={goToStep}
      />
      }
      activeIndex={wizard.activeIndex}
      errors={errors}
      hideNav={hideNav}
      onPrev={wizard.prevStep}
      onNext={() => attemptNext()}
      prevDisabled={wizard.activeIndex === 0}
      className="reg-split-layout min-h-[80vh]"
      contentClassName="reg-content"
    >
      {renderStep()}
    </WizardShell>
  );
}
