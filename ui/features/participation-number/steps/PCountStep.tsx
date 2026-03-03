'use client';

import { useEffect, useState } from 'react';
import { Users, Save, CheckCircle2 } from 'lucide-react';
import { StepHeader } from '@/ui/components/layout/LayoutPrimitives';
import { Button } from '@/ui/design-system/primitives/Button';
import { Skeleton } from '@/ui/design-system/primitives/Skeleton';
import { apiClient } from '@/lib/api/client';
import type { ParticipationNumberFormData } from '../types/ParticipationNumber.types';

interface PCountStepProps {
  formData: ParticipationNumberFormData;
  setFields: (fields: Partial<ParticipationNumberFormData>) => void;
}

export function PCountStep({ formData, setFields }: PCountStepProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { eventId, organizationId, sportId, maleCount, femaleCount } = formData;

  // ── Load existing count when this step mounts ──────────────
  useEffect(() => {
    if (!eventId || !organizationId || !sportId) return;
    setLoading(true);
    setFetchError(null);
    setSaved(false);

    fetch(`/api/participation-stats/count/${eventId}/${organizationId}/${sportId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setFields({
            sportsEventOrgId: json.data.sportsEventOrgId,
            ppsId: json.data.ppsId,
            maleCount: json.data.maleCount ?? 0,
            femaleCount: json.data.femaleCount ?? 0,
          });
        } else {
          setFetchError('មិនអាចទាញទិន្នន័យបាន');
        }
      })
      .catch(() => setFetchError('មិនអាចទាញទិន្នន័យបាន'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, organizationId, sportId]);

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.sportsEventOrgId) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const payload = {
        sportsEventsId: formData.sportsEventOrgId,
        femaleCount: formData.femaleCount,
        maleCount: formData.maleCount,
      };

      if (formData.ppsId) {
        await apiClient.patch(`/api/participation-per-sport/${formData.ppsId}`, payload);
      } else {
        // Create new record
        const res = await apiClient.post<{ id: number }>('/api/participation-per-sport', payload);
        const resAny = res as any;
        if (resAny?.success && resAny?.data?.id) {
          setFields({ ppsId: resAny.data.id });
        }
      }
      setSaved(true);
    } catch {
      setSaveError('មិនអាចរក្សាទុកបាន សូមព្យាយាមម្តងទៀត');
    } finally {
      setSaving(false);
    }
  };

  const total = maleCount + femaleCount;
  const noLink = !formData.sportsEventOrgId && !loading;

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <StepHeader
        title="ចំនួនប្រតិភូចូលរួម"
        subtitle={`${formData.eventName}  ›  ${formData.organizationName}  ›  ${formData.sportName}`}
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : fetchError ? (
        <div
          className="rounded-xl border px-5 py-4"
          style={{ borderColor: 'oklch(0.7 0.2 25)', backgroundColor: 'oklch(0.98 0.02 25)' }}
        >
          <p className="text-sm" style={{ color: 'var(--destructive)' }}>{fetchError}</p>
        </div>
      ) : noLink ? (
        <div
          className="rounded-xl border px-5 py-4"
          style={{ borderColor: 'oklch(0.8 0.1 80)', backgroundColor: 'oklch(0.98 0.02 80)' }}
        >
          <p className="text-sm" style={{ color: 'oklch(0.55 0.15 80)' }}>
            ⚠️ មិនមានការភ្ជាប់ sports_event_org សម្រាប់ការជ្រើសរើសនេះ។ សូមពិនិត្យឡើងវិញ។
          </p>
        </div>
      ) : (
        <>
          {/* Count input cards */}
          <div className="grid grid-cols-2 gap-4">
            <CountCard
              label="បុរស"
              value={maleCount}
              color="var(--reg-indigo-600)"
              bgColor="var(--reg-indigo-50)"
              borderAccent="oklch(0.6 0.2 264)"
              onChange={(v) => { setFields({ maleCount: v }); setSaved(false); }}
            />
            <CountCard
              label="នារី"
              value={femaleCount}
              color="var(--reg-purple-600)"
              bgColor="oklch(0.97 0.015 310)"
              borderAccent="oklch(0.55 0.2 310)"
              onChange={(v) => { setFields({ femaleCount: v }); setSaved(false); }}
            />
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between rounded-2xl px-5 py-4"
            style={{ backgroundColor: 'var(--reg-indigo-50)', border: '1px solid var(--reg-indigo-200)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--reg-indigo-600)' }}
              >
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold" style={{ color: 'var(--reg-slate-700)' }}>
                សរុបចំនួនប្រតិភូ
              </span>
            </div>
            <span className="text-3xl font-bold" style={{ color: 'var(--reg-indigo-600)' }}>
              {total}
            </span>
          </div>

          {/* Save row */}
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? (
                'កំពុងរក្សាទុក...'
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {formData.ppsId ? 'កែប្រែ' : 'រក្សាទុក'}
                </span>
              )}
            </Button>
            {saved && (
              <span
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: 'var(--reg-emerald-700)' }}
              >
                <CheckCircle2 className="h-4 w-4" />
                រក្សាទុករួច
              </span>
            )}
          </div>

          {saveError && (
            <p className="text-xs" style={{ color: 'var(--destructive)' }}>{saveError}</p>
          )}
        </>
      )}
    </div>
  );
}

// ── CountCard ─────────────────────────────────────────────────

function CountCard({
  label,
  value,
  color,
  bgColor,
  borderAccent,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  borderAccent: string;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="space-y-3 rounded-2xl p-5"
      style={{ backgroundColor: bgColor, border: `1px solid color-mix(in oklch, ${borderAccent} 30%, white)` }}
    >
      <p className="text-sm font-bold tracking-wide uppercase" style={{ color }}>
        {label}
      </p>
      <input
        type="number"
        min={0}
        value={value === 0 ? '' : value}
        placeholder="0"
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          onChange(isNaN(v) || v < 0 ? 0 : v);
        }}
        className="w-full rounded-xl border-2 bg-white px-4 py-3 text-center text-3xl font-bold outline-none transition focus:ring-2"
        style={{
          borderColor: value > 0 ? borderAccent : 'oklch(0.88 0 0)',
          color: value > 0 ? color : 'oklch(0.7 0 0)',
          // @ts-ignore
          '--tw-ring-color': borderAccent,
        }}
      />
    </div>
  );
}
