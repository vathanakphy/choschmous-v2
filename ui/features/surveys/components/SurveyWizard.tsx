'use client';
import { useState, useCallback } from 'react';

import { Calendar, Building2, Trophy, CheckCircle2, PartyPopper } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStepWizard } from '@/ui/components/navigation/useStepWizard';
import { WizardShell } from '@/ui/components/navigation/WizardShell';
import { StepSidebar } from '@/ui/components/navigation/StepSidebar';
import { useSurvey, validateSurveyStep } from '../hooks/useSurvey';
import type { SurveyErrors, SurveyFormData } from '../types/Survey.types';
import {
  SurveyEventStep,
  SurveyOrganizationStep,
  SurveySportStep,
  SurveyConfirmStep,
  SurveyCompletedStep,
} from './steps';

const ICONS: LucideIcon[] = [Calendar, Building2, Trophy, CheckCircle2, PartyPopper];
const LABELS = ['ព្រឹត្តិការណ៍', 'អង្គភាព', 'កីឡា', 'បញ្ជាក់', 'បញ្ចប់'];
const KEYS = ['event', 'organization', 'sports', 'confirm', 'done'];

export function SurveyWizard() {
  const { formData, setFields, reset } = useSurvey();
  const [errors, setErrors] = useState<SurveyErrors>({});
  const steps = LABELS.map((label, i) => ({
    key: KEYS[i],
    label,
    icon: ICONS[i],
    component: null as any,
  }));
  const wizard = useStepWizard(steps);

  const attemptNext = useCallback(
    (override?: Partial<SurveyFormData>) => {
      const merged = override ? { ...formData, ...override } : formData;
      const errs = validateSurveyStep(wizard.activeIndex, merged);
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
        return <SurveyEventStep {...p} />;
      case 1:
        return <SurveyOrganizationStep {...p} />;
      case 2:
        return <SurveySportStep {...p} />;
      case 3:
        return (
          <SurveyConfirmStep
            formData={formData}
            onEdit={goToStep}
            onSuccess={() => wizard.nextStep()}
          />
        );
      case 4:
        return (
          <SurveyCompletedStep
            formData={formData}
            onReset={() => {
              reset();
              setErrors({});
              wizard.goToStep(0);
            }}
          />
        );
    }
  };

  const hideNav = wizard.activeIndex >= 2;

  return (
    <WizardShell
      sidebar={
        <StepSidebar
        title="ជំហានស្ទង់មតិ"
        steps={wizard.stepsWithState.map((s, i) => ({
          id: s.key,
          label: s.label,
          index: s.index,
          isActive: s.isActive,
          isCompleted: s.isCompleted,
          isAccessible: s.isAccessible,
          icon: ICONS[i],
        }))}
        totalSteps={steps.length}
        onNavigate={(id) => {
          const i = KEYS.indexOf(id);
          if (i !== -1) goToStep(i);
        }}
      />
      }
      activeIndex={wizard.activeIndex}
      errors={errors}
      hideNav={hideNav}
      onPrev={wizard.prevStep}
      onNext={() => attemptNext()}
      prevDisabled={wizard.activeIndex === 0}
      className="min-h-screen"
    >
      {renderStep()}
    </WizardShell>
  );
}
