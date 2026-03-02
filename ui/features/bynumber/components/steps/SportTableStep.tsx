'use client';

import { useEffect } from 'react';
import { StepHeader } from '@/ui/components/layout/LayoutPrimitives';
import { FetchState } from '@/ui/components/feedback';
import { useFetchList } from '@/ui/hooks/useFetchList';
import { SportSummaryTable } from '@/ui/components/data-display/SportSummaryTable';
import type { ByNumberFormData, ByNumberErrors, SportSelection } from '../../types/ByNumber.types';

interface SportTableStepProps {
  formData: ByNumberFormData;
  errors: ByNumberErrors;
  setCount: (sportsEventOrgId: number, gender: 'maleCount' | 'femaleCount', value: number) => void;
  initSports: (sports: SportSelection[]) => void;
}

export function SportTableStep({ formData, errors, setCount, initSports }: SportTableStepProps) {
  const url = formData.eventId && formData.organizationId
    ? `/api/orgprosports?events_id=${formData.eventId}&organization_id=${formData.organizationId}&limit=100`
    : null;

  const mapSport = (item: any): SportSelection => ({
    sportsEventOrgId: item.id,
    sportId: item.sports_id,
    sportName: item.sport_name ?? item.sports?.name_kh ?? item.sports?.name ?? `Sport ${item.sports_id}`,
    maleCount: 0,
    femaleCount: 0,
  });

  const { data: fetchedSports, loading, error: fetchError } = useFetchList(url, mapSport, [formData.eventId, formData.organizationId]);

  useEffect(() => {
    if (fetchedSports.length > 0) initSports(fetchedSports);
  }, [fetchedSports]);

  return (
    <div className="space-y-6">
      <StepHeader
        title="ចំនួនអ្នកចូលរួមតាមកីឡា"
        subtitle="សូមបំពេញចំនួនបុរស និងនារីសម្រាប់កីឡានីមួយៗ"
      />

      <FetchState loading={loading} error={fetchError} empty={formData.sportSelections.length === 0} skeletonCount={5} skeletonHeight="h-12" skeletonCols={1}>
        <SportSummaryTable
          rows={formData.sportSelections}
          mode="editable"
          onChangeCount={setCount}
          hasRowError={(sel) => sel.maleCount === 0 && sel.femaleCount === 0 && !!errors.sportSelections}
        />
      </FetchState>

      {errors.sportSelections && (
        <p className="text-xs" style={{ color: 'var(--destructive)' }}>
          {errors.sportSelections}
        </p>
      )}
    </div>
  );
}

