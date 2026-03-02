'use client';

import { PartyPopper } from 'lucide-react';
import { Button } from '@/ui/design-system/primitives/Button';
import { CompletedStepLayout } from '@/ui/components/layout/CompletedStepLayout';
import type { ByNumberFormData } from '../../types/ByNumber.types';

interface CompletedByNumberStepProps {
  formData: ByNumberFormData;
  onGoHome: () => void;
}

export function CompletedByNumberStep({ formData, onGoHome }: CompletedByNumberStepProps) {
  return (
    <CompletedStepLayout
      icon={<PartyPopper className="h-10 w-10" style={{ color: 'var(--reg-indigo-600)' }} />}
      iconClassName="bg-[var(--reg-indigo-50)]"
      title="ដាក់ស្នើដោយជោគជ័យ!"
      titleClassName="text-foreground"
      actions={
        <Button variant="outline" onClick={onGoHome} className="rounded-full px-10">
          ត្រឡប់ទៅដើម
        </Button>
      }
    >
      <p className="text-muted-foreground text-sm">ព្រឹត្តិការណ៍: <span className="text-foreground font-medium">{formData.eventName}</span></p>
      <p className="text-muted-foreground text-sm">អង្គភាព: <span className="text-foreground font-medium">{formData.organizationName}</span></p>
      <p className="text-muted-foreground text-sm">កីឡាដែលបានជ្រើសរើស:{' '}
          <span className="text-foreground font-medium">
            {formData.sportSelections.filter((s) => s.maleCount || s.femaleCount).length} ប្រភេទ
          </span></p>
    </CompletedStepLayout>
  );
}
