'use client';

import { Check, Trophy } from 'lucide-react';
import { FetchState } from '@/ui/components/feedback';
import { useFetchList } from '@/ui/hooks/useFetchList';
import { Button } from '@/ui/design-system/primitives/Button';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';
import type { StepProps, SportItem } from '../../types/Survey.types';

function mapSport(raw: any): SportItem {
  return { id: raw.id, name: raw.name_kh ?? raw.name ?? '' };
}

export function SurveySportStep({ formData, setFields, errors, onNext }: StepProps) {
  const { data: sports, loading, error: fetchError } = useFetchList('/api/sports?skip=0&limit=100', mapSport);

  const toggle = (sport: SportItem) => {
    const id = String(sport.id);
    const already = formData.sportIds.includes(id);
    const sportIds = already
      ? formData.sportIds.filter((s) => s !== id)
      : [...formData.sportIds, id];
    const sportNames = already
      ? formData.sportNames.filter((_, i) => formData.sportIds[i] !== id)
      : [...formData.sportNames, sport.name];
    setFields({ sportIds, sportNames });
  };

  return (
    <div className="space-y-6">
      <StepHeader title="ជ្រើសរើសកីឡា" subtitle="អ្នកអាចជ្រើសរើសកីឡាច្រើន" />
      {formData.sportIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.sportNames.map((name, i) => (
            <span key={i} className="survey-tag">
              <Trophy className="h-3 w-3" />
              {name}
              <button
                type="button"
                onClick={() => toggle({ id: Number(formData.sportIds[i]), name })}
                className="ml-1 opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
      <FetchState loading={loading} error={fetchError} empty={sports.length === 0}>
        <Grid cols={2}>
          {sports.map((sport) => {
            const sel = formData.sportIds.includes(String(sport.id));
            return (
              <button
                key={sport.id}
                type="button"
                onClick={() => toggle(sport)}
                className={`survey-card group ${sel ? 'selected' : ''}`}
              >
                {sel && (
                  <div className="survey-card-check">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <h3 className={`survey-card-title ${sel ? 'selected' : ''}`}>{sport.name}</h3>
                {sel && <p className="text-primary-foreground/60 mt-1 text-xs">✓ បានជ្រើស</p>}
              </button>
            );
          })}
        </Grid>
      </FetchState>
      {errors.sports && <p className="text-destructive text-xs">{errors.sports}</p>}
      {formData.sportIds.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={() => (onNext as any)()}>បន្ត ({formData.sportIds.length} កីឡា)</Button>
        </div>
      )}
    </div>
  );
}
