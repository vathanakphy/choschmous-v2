'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  Building2,
  Trophy,
  Grid3x3,
  User,
  CheckCircle2,
  PartyPopper,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStepWizard } from '@/ui/components/navigation/useStepWizard';
import { WizardShell } from '@/ui/components/navigation/WizardShell';
import { RegistrationSidebar } from './RegistrationSidebar';
import { useRegistration, validateStep } from '../hooks/useRegistration';
import type { RegistrationErrors, RegistrationFormData } from '../hooks/useRegistration';
import { PhotoStorage } from '../hooks/photoStorage';
import {
  EventStep,
  OrganizationStep,
  SportStep,
  CategoryStep,
  PersonalInfoStep,
  ConfirmationStep,
  CompletedStep,
} from '@/ui/features/registrations/components/steps';
import { ROUTES } from '@/config/routes';

interface Event {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  sports?: any[];
}

const ICONS: LucideIcon[] = [Calendar, Building2, Trophy, Grid3x3, User, CheckCircle2, PartyPopper];
const LABELS = [
  'ព្រឹត្តិការណ៍',
  'អង្គភាព',
  'កីឡា',
  'ប្រភេទ',
  'ព័ត៌មានផ្ទាល់ខ្លួន',
  'បញ្ជាក់',
  'បញ្ចប់',
];

// Maps index → ROUTES.PUBLIC.REGISTER step values
const STEP_ROUTES = [
  ROUTES.PUBLIC.REGISTER.event, // ?step=event
  ROUTES.PUBLIC.REGISTER.organization, // ?step=organization
  ROUTES.PUBLIC.REGISTER.sport, // ?step=sport
  ROUTES.PUBLIC.REGISTER.category, // ?step=category
  ROUTES.PUBLIC.REGISTER.personalInfo, // ?step=personal-info
  ROUTES.PUBLIC.REGISTER.confirmation, // ?step=confirmation
  ROUTES.PUBLIC.REGISTER.completed, // ?step=action
] as const;

// Extract just the step value from each route string (e.g. 'event', 'organization', ...)
const STEP_KEYS = STEP_ROUTES.map((r) => new URLSearchParams(r.split('?')[1]).get('step') ?? '');

export function RegistrationWizard({
  events,
  eventsLoading,
}: {
  events: Event[];
  eventsLoading?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive initial step index from ?step= URL param
  const stepParam = searchParams.get('step');
  const initialStep = stepParam ? Math.max(STEP_KEYS.indexOf(stepParam), 0) : 0;

  const { formData, setFields, resetPersonal } = useRegistration();
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [enrollId, setEnrollId] = useState<number | null>(null);

  // Clear all persisted draft data on page load so a refresh starts fresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Clear localStorage draft keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('reg_personal_draft__')) {
        localStorage.removeItem(key);
      }
    });
    // Clear IndexedDB photo storage
    PhotoStorage.clear();
  }, []);

  const currentEvent = events.filter(Boolean).find((e) => e && e.id === formData.eventId);

  const steps = LABELS.map((label, i) => ({
    key: STEP_KEYS[i],
    label,
    icon: ICONS[i],
    component: null as any,
  }));

  // Sync URL whenever the active step changes
  const handleStepChange = useCallback(
    (index: number) => {
      router.replace(STEP_ROUTES[index], { scroll: false });
    },
    [router]
  );

  const wizard = useStepWizard(steps, initialStep, handleStepChange);

  // If user navigates back/forward in browser, sync wizard to URL
  useEffect(() => {
    const param = searchParams.get('step');
    const idx = param ? STEP_KEYS.indexOf(param) : 0;
    if (idx !== -1 && idx !== wizard.activeIndex) {
      wizard.goToStep(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const attemptNext = useCallback(
    (override?: Partial<RegistrationFormData>) => {
      const merged = override ? { ...formData, ...override } : formData;
      const errs = validateStep(wizard.activeIndex, merged);
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
    const p = { formData, setFields, errors, onNext: attemptNext };
    switch (wizard.activeIndex) {
      case 0:
        return <EventStep {...p} events={events} loading={eventsLoading} />;
      case 1:
        return <OrganizationStep {...p} />;
      case 2:
        return <SportStep {...p} />;
      case 3:
        return <CategoryStep {...p} />;
      case 4:
        return <PersonalInfoStep {...p} />;
      case 5:
        return (
          <ConfirmationStep
            formData={formData}
            onEdit={goToStep}
            onSuccess={(id) => {
              setEnrollId(id);
              wizard.nextStep();
            }}
          />
        );
      case 6:
        return (
          <CompletedStep
            formData={formData}
            enrollId={enrollId}
            onGoHome={() => router.push('/')}
            onAddMore={() => {
              resetPersonal();
              setErrors({});
              setEnrollId(null);
              goToStep(4);
            }}
          />
        );
    }
  };

  const hideNav = wizard.activeIndex >= 4;

  return (
    <WizardShell
      sidebar={
        <RegistrationSidebar
        steps={wizard.stepsWithState.map((s, i) => ({
          ...s,
          icon: ICONS[i],
          completedIcon: undefined,
        }))}
        activeIndex={wizard.activeIndex}
        gotoStep={goToStep}
        gotoStepByKey={(key) => {
          const i = STEP_KEYS.indexOf(key);
          if (i !== -1) goToStep(i);
        }}
        prevStep={wizard.prevStep}
        nextStep={wizard.nextStep}
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
