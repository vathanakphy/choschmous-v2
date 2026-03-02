'use client';
import { Check, Building2 } from 'lucide-react';
import { StepHeader, Grid } from '@/ui/components/layout/LayoutPrimitives';
import { FetchState } from '@/ui/components/feedback';
import { useFetchList } from '@/ui/hooks/useFetchList';
import type { StepProps, OrgItem } from '../../types/Survey.types';

function mapOrg(raw: any): OrgItem {
  return {
    id: raw.id,
    name: raw.name_kh ?? raw.name ?? '',
    type: raw.type ?? '',
    code: raw.code ?? null,
  };
}

export function SurveyOrganizationStep({ formData, setFields, errors, onNext }: StepProps) {
  const {
    data: orgs,
    loading,
    error: fetchError,
  } = useFetchList('/api/organizations?limit=100', mapOrg);

  const handleSelect = (org: OrgItem) => {
    const fields = { organizationId: String(org.id), organizationName: org.name };
    setFields(fields);
    (onNext as any)(fields);
  };

  return (
    <div className="space-y-6">
      <StepHeader title="ជ្រើសរើសអង្គភាព" subtitle="ជ្រើសរើសខេត្ត ឬស្ថាប័នដែលអ្នកតំណាង" />
      <FetchState loading={loading} error={fetchError} empty={orgs.length === 0}>
        <Grid cols={2}>
          {orgs.map((org) => {
            const sel = formData.organizationId === String(org.id);
            return (
              <button
                key={org.id}
                type="button"
                onClick={() => handleSelect(org)}
                className={`survey-card group ${sel ? 'selected' : ''}`}
              >
                {sel && (
                  <div className="survey-card-check">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${sel ? 'bg-primary' : 'bg-primary/10'}`}
                  >
                    <Building2
                      className={`h-4 w-4 ${sel ? 'text-primary-foreground' : 'text-primary'}`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`survey-card-title ${sel ? 'selected' : ''}`}
                      style={{ marginBottom: 0 }}
                    >
                      {org.name}
                    </h3>
                    {org.code && <p className="survey-card-sub mt-0.5 text-xs">{org.code}</p>}
                  </div>
                </div>
                {org.type && (
                  <p
                    className={`mt-3 text-xs font-medium tracking-wide uppercase ${sel ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}
                  >
                    {org.type === 'province' ? 'ខេត្ត / រាជធានី' : org.type}
                  </p>
                )}
              </button>
            );
          })}
        </Grid>
      </FetchState>
      {errors.organizationId && <p className="text-destructive text-xs">{errors.organizationId}</p>}
    </div>
  );
}
