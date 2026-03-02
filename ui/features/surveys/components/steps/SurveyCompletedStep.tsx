'use client';
import { PartyPopper, RotateCcw } from 'lucide-react';
import { Button } from '@/ui/design-system/primitives/Button';
import { CompletedStepLayout } from '@/ui/components/layout/CompletedStepLayout';
import type { SurveyFormData } from '../../types/Survey.types';

interface Props {
  formData: SurveyFormData;
  onReset: () => void;
}

export function SurveyCompletedStep({ formData, onReset }: Props) {
  return (
    <CompletedStepLayout
      icon={<PartyPopper className="text-primary h-10 w-10" />}
      iconClassName="bg-primary/10"
      title="បញ្ជូនដោយជោគជ័យ!"
      titleClassName="text-foreground"
      actions={
        <Button variant="outline" onClick={onReset} className="rounded-full">
          <RotateCcw className="h-4 w-4" /> ស្ទង់មតិម្ដងទៀត
        </Button>
      }
    >
      <p className="text-muted-foreground">
        ការស្ទង់មតិសម្រាប់{' '}
          <span className="text-primary font-semibold">{formData.organizationName}</span> នៅក្នុង{' '}
          <span className="text-foreground font-semibold">{formData.eventName}</span>{' '}
          ត្រូវបានចុះឈ្មោះ។
      </p>
      <p className="text-muted-foreground/60 text-sm">
        {formData.sportIds.length} កីឡាត្រូវបានជ្រើស
      </p>
    </CompletedStepLayout>
  );
}
