'use client';

import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/ui/design-system/primitives/Button';
import { SubmitError } from '@/ui/components/feedback';
import { SportSummaryTable } from '@/ui/components/data-display/SportSummaryTable';
import { InfoRow } from '@/ui/components/layout/LayoutPrimitives';
import { SectionCard } from '@/ui/components/layout/LayoutPrimitives';
import type { ByNumberFormData } from '../../types/ByNumber.types';

interface ConfirmByNumberStepProps {
  formData: ByNumberFormData;
  onEdit: (step: number) => void;
  onSuccess: () => void;
}

export function ConfirmByNumberStep({ formData, onEdit, onSuccess }: ConfirmByNumberStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalMale = formData.sportSelections.reduce((s, x) => s + (x.maleCount || 0), 0);
  const totalFemale = formData.sportSelections.reduce((s, x) => s + (x.femaleCount || 0), 0);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Submit one record per sport row
      const results = await Promise.all(
        formData.sportSelections.map((sel) =>
          fetch('/api/bynumber', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sportsEventOrgId: sel.sportsEventOrgId,
              maleCount: sel.maleCount,
              femaleCount: sel.femaleCount,
            }),
          }).then((r) => {
            if (!r.ok) throw new Error(`Failed for ${sel.sportName}`);
            return r.json();
          })
        )
      );
      onSuccess();
    } catch (e: any) {
      setError(e.message ?? 'មានបញ្ហាកើតឡើង');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-foreground text-xl font-bold">បញ្ជាក់ព័ត៌មាន</h2>
        <p className="text-muted-foreground mt-1 text-sm">សូមពិនិត្យព័ត៌មានមុនពេលដាក់ស្នើ</p>
      </div>

      {/* Event & Org */}
      <SectionCard>
        <InfoRow label="ព្រឹត្តិការណ៍" value={formData.eventName} onEdit={() => onEdit(0)} />
        <InfoRow label="អង្គភាព" value={formData.organizationName} onEdit={() => onEdit(1)} />
      </SectionCard>

      {/* Sport table */}
      <SectionCard
        title="កីឡាដែលបានបំពេញ"
        headerSlot={
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--reg-indigo-600)' }}
          >
            <Edit2 className="h-3 w-3" />
            កែប្រែ
          </button>
        }
      >
        <SportSummaryTable rows={formData.sportSelections} mode="readonly" />
      </SectionCard>

      <SubmitError error={error} />

      <Button onClick={handleSubmit} disabled={loading} className="w-full rounded-full" size="lg">
        {loading ? 'កំពុងដាក់ស្នើ...' : 'ដាក់ស្នើ'}
      </Button>
    </div>
  );
}

