'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Edit2, QrCode } from 'lucide-react';
import { Button } from '@/ui/design-system/primitives/Button';
import { SectionCard, StepHeader, InfoRow } from '@/ui/components/layout/LayoutPrimitives';
import { submitRegistrationAction } from '../../actions/submitRegistration';
import { GENDER_LABELS, ROLE_LABELS, ID_DOC_LABELS } from '../../types/Registration.types';
import type { RegistrationFormData, LeaderRole } from '../../types/Registration.types';

// ─── Props ────────────────────────────────────────────────────

interface ConfirmationStepProps {
  formData: RegistrationFormData;
  onEdit: (step: number) => void;
  onSuccess: (enrollId: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────

function resolveRoleLabel(formData: RegistrationFormData): string {
  if (formData.role === 'Athlete') return ROLE_LABELS.Athlete;
  if (formData.role === 'Leader' || formData.role === 'Technical') {
    return ROLE_LABELS[formData.leaderRole as LeaderRole] ?? formData.leaderRole;
  }
  return '—';
}

function getFullNameKhmer(formData: RegistrationFormData): string {
  const first = formData.firstNameKhmer ?? '';
  const last = formData.lastNameKhmer ?? '';
  return [last, first].filter(Boolean).join(' ') || formData.fullNameKhmer || '—';
}

function getFullNameLatin(formData: RegistrationFormData): string {
  const first = formData.firstNameLatin ?? '';
  const last = formData.lastNameLatin ?? '';
  return [first, last].filter(Boolean).join(' ') || formData.fullNameEnglish || '—';
}

// ─── ID Card Preview ──────────────────────────────────────────

function IDCardPreview({
  formData,
  onEdit,
}: {
  formData: RegistrationFormData;
  onEdit: () => void;
}) {
  const fullKhmer = getFullNameKhmer(formData);
  const fullLatin = getFullNameLatin(formData);
  const roleLabel = resolveRoleLabel(formData);
  const photoUrl = formData.photoUpload ? URL.createObjectURL(formData.photoUpload) : null;

  return (
    <div className="relative">
      {/* Edit button */}
      <button
        onClick={onEdit}
        className="border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary absolute -top-2 -right-2 z-10 flex items-center gap-1 rounded-full border px-2 py-1 text-xs shadow-sm transition-colors"
      >
        <Edit2 className="h-3 w-3" />
        Edit
      </button>

      {/* Card */}
      <div
        className="mx-auto overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: 280,
          background: 'white',
          border: '2px solid #1a3a8c',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Card header — blue banner */}
        <div
          className="px-3 py-2 text-center"
          style={{ background: 'linear-gradient(135deg, #1a3a8c 0%, #1565c0 100%)' }}
        >
          <p className="text-[9px] font-bold tracking-wide text-white opacity-90">
            គីឡូសាប្រចាំជាតិ ២០២៦
          </p>
          <p className="text-[8px] tracking-widest text-blue-200 uppercase">
            NATIONAL PRIMARY SCHOOL GAMES 2026
          </p>
        </div>

        {/* Card body */}
        <div className="flex gap-3 p-3">
          {/* Photo */}
          <div
            className="border-border bg-muted flex shrink-0 items-center justify-center overflow-hidden rounded-md border-2"
            style={{ width: 70, height: 88 }}
          >
            {photoUrl ? (
              <img src={photoUrl} alt="profile" className="h-full w-full object-cover" />
            ) : (
              <div className="text-muted-foreground/30 flex flex-col items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <span className="text-[9px]">4×6</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            {/* Name in Khmer */}
            <p className="text-foreground truncate text-[11px] leading-tight font-bold">
              {fullKhmer}
            </p>
            {/* Name in Latin */}
            <p className="text-muted-foreground mb-2 truncate text-[10px]">{fullLatin}</p>

            {/* Role badge */}
            <div
              className="mb-2 inline-block rounded px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase"
              style={{ background: '#e53935' }}
            >
              {roleLabel || '—'}
            </div>

            {/* Info rows */}
            <div className="space-y-0.5">
              <InfoChip
                label="ភេទ"
                value={
                  GENDER_LABELS[formData.gender as keyof typeof GENDER_LABELS] ?? formData.gender
                }
              />
              <InfoChip label="កំណើត" value={formData.dateOfBirth || '—'} />
              <InfoChip label="ស្ថាប័ន" value={formData.organizationName || '—'} />
              <InfoChip label="កីឡា" value={formData.sportName || '—'} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-border mx-3 border-t border-dashed" />

        {/* QR + event */}
        <div className="flex items-center justify-between px-3 py-2">
          {/* QR placeholder */}
          <div className="border-border bg-muted/50 rounded border p-1">
            <QrCode className="text-muted-foreground/60 h-8 w-8" />
          </div>
          <div className="text-right">
            <p className="text-muted-foreground/60 text-[8px] tracking-wider uppercase">
              {formData.eventName || '—'}
            </p>
            <p className="text-muted-foreground/60 text-[8px]">{formData.categoryName || '—'}</p>
          </div>
        </div>

        {/* Footer blue bar */}
        <div
          className="px-3 py-1.5 text-center"
          style={{ background: 'linear-gradient(135deg, #1a3a8c 0%, #1565c0 100%)' }}
        >
          <p className="text-[9px] font-bold tracking-widest text-white uppercase">កីឡាបាល់ទាត់</p>
        </div>
      </div>

      <p className="text-muted-foreground/60 mt-2 text-center text-[10px]">
        Card preview (A6 format)
      </p>
    </div>
  );
}

// ─── Mini chip for card ───────────────────────────────────────

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground/60 w-10 shrink-0 text-[8px]">{label}</span>
      <span className="text-foreground truncate text-[9px] font-medium">{value}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────

export function ConfirmationStep({ formData, onEdit, onSuccess }: ConfirmationStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        photoUpload,
        nationalityDocumentUpload,
        docBirthCertificate,
        docNationalId,
        docPassport,
        ...payload
      } = formData;

      const result = await submitRegistrationAction(
        payload,
        photoUpload ?? null,
        // DB has ONE documents_path varchar — pick the first uploaded doc
        docBirthCertificate ?? docNationalId ?? docPassport ?? nationalityDocumentUpload ?? null
      );

      if (result.success && result.enrollId) {
        onSuccess(result.enrollId);
      } else {
        setError(result.error ?? 'ការដាក់ស្នើបរាជ័យ');
      }
    } catch {
      setError('ការដាក់ស្នើបរាជ័យ');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = resolveRoleLabel(formData);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <StepHeader title="បញ្ជាក់ការចុះឈ្មោះ" subtitle="សូមពិនិត្យព័ត៌មានមុនបញ្ជូន" />

      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>
          ពិនិត្យព័ត៌មានឱ្យបានត្រឹមត្រូវ — Please verify all information before submitting.
        </span>
      </div>

      {/* Two-column: left = info, right = card preview */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ─── Left: All information ─────────────────────── */}
        <div className="flex-1 space-y-4">
          {/* Event & Sport */}
          <SectionCard title="ព្រឹត្តិការណ៍ និង កីឡា / Event & Sport">
            <InfoRow label="ព្រឹត្តិការណ៍" value={formData.eventName} onEdit={() => onEdit(0)} />
            <InfoRow label="ស្ថាប័ន" value={formData.organizationName} onEdit={() => onEdit(1)} />
            <InfoRow label="កីឡា" value={formData.sportName} onEdit={() => onEdit(2)} />
            <InfoRow label="ប្រភេទ" value={formData.categoryName} onEdit={() => onEdit(3)} />
          </SectionCard>

          {/* Name */}
          <SectionCard title="ឈ្មោះ / Name">
            <div className="grid grid-cols-2 gap-x-6">
              <div>
                <p className="text-muted-foreground/60 mb-0.5 text-xs">នាមខ្លួន (ខ្មែរ)</p>
                <p className="text-foreground text-sm font-medium">
                  {formData.firstNameKhmer || '—'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground/60 mb-0.5 text-xs">First Name</p>
                <p className="text-foreground text-sm font-medium">
                  {formData.firstNameLatin || '—'}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-muted-foreground/60 mb-0.5 text-xs">នាមត្រកូល (ខ្មែរ)</p>
                <p className="text-foreground text-sm font-medium">
                  {formData.lastNameKhmer || '—'}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-muted-foreground/60 mb-0.5 text-xs">Last Name</p>
                <p className="text-foreground text-sm font-medium">
                  {formData.lastNameLatin || '—'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onEdit(4)}
              className="text-primary mt-2 flex items-center gap-1 text-xs hover:underline"
            >
              <Edit2 className="h-3 w-3" /> Edit name
            </button>
          </SectionCard>

          {/* Identity & Contact */}
          <SectionCard title="អត្តសញ្ញាណ & ទំនាក់ទំនង / Identity & Contact">
            <InfoRow
              label="ភេទ / Gender"
              value={
                GENDER_LABELS[formData.gender as keyof typeof GENDER_LABELS] ?? formData.gender
              }
              onEdit={() => onEdit(4)}
            />
            <InfoRow
              label="ថ្ងៃកំណើត / DOB"
              value={formData.dateOfBirth}
              onEdit={() => onEdit(4)}
            />
            <InfoRow
              label="លេខអត្តសញ្ញាណ / National ID"
              value={formData.nationalID}
              onEdit={() => onEdit(4)}
            />
            <InfoRow label="ទូរស័ព្ទ / Phone" value={formData.phone} onEdit={() => onEdit(4)} />
          </SectionCard>

          {/* Position */}
          <SectionCard title="តួនាទី / Position">
            <InfoRow label="Position" value={roleLabel} onEdit={() => onEdit(4)} />
          </SectionCard>

          {/* Documents uploaded */}
          <SectionCard title="ឯកសារ / Documents">
            <InfoRow
              label="រូបថត / Photo"
              value={formData.photoUpload ? `✓ ${formData.photoUpload.name}` : 'Not uploaded'}
              onEdit={() => onEdit(4)}
            />
            <InfoRow
              label="ប្រភេទឯកសារ / Doc Type"
              value={
                formData.idDocType
                  ? (ID_DOC_LABELS[formData.idDocType as keyof typeof ID_DOC_LABELS] ??
                    formData.idDocType)
                  : '—'
              }
              onEdit={() => onEdit(4)}
            />
            <InfoRow
              label="ឯកសារ / Document"
              value={
                (formData.docBirthCertificate ??
                formData.docNationalId ??
                formData.docPassport ??
                formData.nationalityDocumentUpload)
                  ? `✓ ${(formData.docBirthCertificate ?? formData.docNationalId ?? formData.docPassport ?? formData.nationalityDocumentUpload)!.name}`
                  : 'Not uploaded'
              }
              onEdit={() => onEdit(4)}
            />
          </SectionCard>
        </div>

        {/* ─── Right: ID Card Preview ────────────────────── */}
        <div className="flex flex-col items-center pt-2 lg:w-72">
          <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
            Card Preview
          </p>
          <IDCardPreview formData={formData} onEdit={() => onEdit(4)} />
        </div>
      </div>

      {error && (
        <p className="border-destructive/20 bg-destructive/5 text-destructive rounded-lg border p-3 text-sm">
          {error}
        </p>
      )}

      <div className="flex justify-center gap-3 pt-2">
        <Button variant="outline" onClick={() => onEdit(4)} disabled={loading}>
          កែសម្រួល / Edit
        </Button>
        <Button onClick={handleSubmit} disabled={loading} className="min-w-44">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              កំពុងបញ្ជូន...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              បញ្ជាក់ ចុះឈ្មោះ / Confirm
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
