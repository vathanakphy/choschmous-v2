'use client';
import { useState } from 'react';
import { CheckCircle2, Trophy, Building2, Calendar, Loader2 } from 'lucide-react';
import { StepHeader } from '@/ui/components/layout/LayoutPrimitives';
import { Button } from '@/ui/design-system/primitives/Button';
import { SubmitError } from '@/ui/components/feedback';
import type { SurveyFormData } from '../../types/Survey.types';

interface Props {
  formData: SurveyFormData;
  onEdit: (step: number) => void;
  onSuccess: () => void;
}

export function SurveyConfirmStep({ formData, onEdit, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: Number(formData.eventId),
          organizationId: Number(formData.organizationId),
          sportIds: formData.sportIds.map(Number),
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      onSuccess();
    } catch (e: any) {
      setError('មានបញ្ហាក្នុងការបញ្ជូន — ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader title="បញ្ជាក់ព័ត៌មាន" subtitle="សូមពិនិត្យព័ត៌មានមុននឹងបញ្ជូន" />
      <div className="survey-confirm-card">
        <div className="survey-confirm-section">
          <div className="survey-confirm-icon">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="survey-confirm-label">ព្រឹត្តិការណ៍</p>
            <div className="flex items-center justify-between">
              <p className="text-foreground text-sm font-medium">{formData.eventName}</p>
              <button
                type="button"
                onClick={() => onEdit(0)}
                className="text-primary text-xs hover:underline"
              >
                កែប្រែ
              </button>
            </div>
          </div>
        </div>
        <div className="survey-confirm-section">
          <div className="survey-confirm-icon">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="survey-confirm-label">អង្គភាព</p>
            <div className="flex items-center justify-between">
              <p className="text-foreground text-sm font-medium">{formData.organizationName}</p>
              <button
                type="button"
                onClick={() => onEdit(1)}
                className="text-primary text-xs hover:underline"
              >
                កែប្រែ
              </button>
            </div>
          </div>
        </div>
        <div className="survey-confirm-section" style={{ borderBottom: 0 }}>
          <div className="survey-confirm-icon">
            <Trophy className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <p className="survey-confirm-label">កីឡា ({formData.sportIds.length})</p>
              <button
                type="button"
                onClick={() => onEdit(2)}
                className="text-primary text-xs hover:underline"
              >
                កែប្រែ
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sportNames.map((name, i) => (
                <span key={i} className="survey-tag">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SubmitError error={error} />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> កំពុងបញ្ជូន…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" /> បញ្ជូន
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
