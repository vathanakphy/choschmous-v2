'use client';

/**
 * Personalinfostep.tsx
 *
 * Fixes:
 *  1. Gender error clears immediately on selection
 *  2. Photo error clears immediately on upload
 *  3. Athlete role uses radio, auto-sets category from gender
 *  4. idDocType synced when document checkboxes change
 *  5. FIX: doc checkbox selection stored in `selectedDocKeys` NOT `nationality`
 *     Previously `nationality` was being overwritten with doc key strings like
 *     "docNationalId,docBirthCertificate" which corrupted enrollments.nationality
 */

import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText, CreditCard, BookOpen, CheckCircle2, Flag } from 'lucide-react';
import { Input } from '@/ui/design-system/primitives/Input';
import { Checkbox } from '@/ui/design-system/primitives/checkbox';
import { Field, NativeSelect } from '@/ui/components/layout/FormControls';
import {
  SectionCard,
  StepHeader,
  ActionFooter,
  Grid,
} from '@/ui/components/layout/LayoutPrimitives';
import {
  GENDER_OPTIONS,
  LEADER_ROLE_OPTIONS,
} from '@/ui/features/registrations/types/Registration.types';
import type {
  StepProps,
  Gender,
  LeaderRole,
  AthleteCategory,
  RegistrationFormData,
  IdDocType,
} from '@/ui/features/registrations/types/Registration.types';
import { usePersonalInfoDraft } from '@/ui/features/registrations/hooks/usePersonalInfoDraft';
import type { PhotoSlotKey } from '@/ui/features/registrations/hooks/usePersonalInfoDraft';

// ─── Verification document slot config ───────────────────────

const VERIFY_DOCS: {
  key: PhotoSlotKey;
  label: string;
  labelEn: string;
  Icon: React.ElementType;
}[] = [
  {
    key: 'docBirthCertificate',
    label: 'សំបុត្រកំណើត',
    labelEn: 'Birth Certificate',
    Icon: BookOpen,
  },
  { key: 'docNationalId', label: 'អត្តសញ្ញាណប័ណ្ណ', labelEn: 'National ID', Icon: CreditCard },
  { key: 'docPassport', label: 'លិខិតឆ្លងដែន', labelEn: 'Passport', Icon: FileText },
  {
    key: 'nationalityDocumentUpload',
    label: 'ឯកសារជាតិសញ្ជាតិ',
    labelEn: 'Nationality Document',
    Icon: Flag,
  },
];

// Map doc checkbox keys to idDocType enum values for the backend
const DOC_KEY_TO_IDTYPE: Record<string, string> = {
  docNationalId: 'IDCard',
  docBirthCertificate: 'BirthCertificate',
  docPassport: 'Passport',
  nationalityDocumentUpload: 'BirthCertificate',
};

// ─── Portrait upload (4×6) ────────────────────────────────────

interface PortraitUploadProps {
  file: File | null;
  slotId: string;
  onFile: (f: File | null) => void;
  error?: string;
}

export function PortraitUpload({ file, slotId, onFile, error }: PortraitUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() =>
    file ? URL.createObjectURL(file) : null
  );

  const handle = useCallback(
    (incoming: File) => {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(incoming);
      });
      onFile(incoming);
    },
    [onFile]
  );

  const clear = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    onFile(null);
  }, [onFile]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p
        className="text-muted-foreground/40 font-mono text-[9px] select-all"
        title="Storage slot ID"
      >
        {slotId}
      </p>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload portrait photo"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handle(f);
        }}
        className={[
          'relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200',
          'focus:ring-primary/60 shadow-sm focus:ring-2 focus:outline-none',
          error
            ? 'border-destructive/60 bg-destructive/5'
            : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5',
        ].join(' ')}
        style={{ width: 128, height: 180 }}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Portrait preview" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-1.5 right-1.5 rounded-full p-1 shadow-lg transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
            <svg
              viewBox="0 0 60 80"
              className="text-muted-foreground/30 w-14"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="30" cy="22" r="15" />
              <ellipse cx="30" cy="62" rx="24" ry="18" />
            </svg>
            <div className="text-center">
              <p className="text-muted-foreground text-[11px] font-medium">រូបថត ៤×៦</p>
              <p className="text-muted-foreground/60 text-[10px]">ចុច ឬ អូស</p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
      <p className="text-muted-foreground/60 text-[10px]">PNG / JPG · ≤ 5 MB</p>
    </div>
  );
}

// ─── Doc upload slot ──────────────────────────────────────────

interface DocUploadSlotProps {
  label: string;
  labelEn: string;
  Icon: React.ElementType;
  slotId: string;
  file: File | null;
  onFile: (f: File | null) => void;
  error?: string;
}

export function DocUploadSlot({
  label,
  labelEn,
  Icon,
  slotId,
  file,
  onFile,
  error,
}: DocUploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handle = useCallback(
    (incoming: File) => {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return incoming.type.startsWith('image/') ? URL.createObjectURL(incoming) : null;
      });
      onFile(incoming);
    },
    [onFile]
  );

  const clear = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    onFile(null);
  }, [onFile]);

  return (
    <div className="flex flex-col gap-1">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${labelEn}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handle(f);
        }}
        className={[
          'relative flex min-h-27.5 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-3',
          'focus:ring-primary/60 transition-all duration-200 focus:ring-2 focus:outline-none',
          error
            ? 'border-destructive/40 bg-destructive/5'
            : file
              ? 'border-chart-2/60 bg-chart-2/5'
              : 'border-border bg-muted/50 hover:border-primary/40 hover:bg-primary/5',
        ].join(' ')}
      >
        {previewUrl && (
          <img src={previewUrl} alt={labelEn} className="mb-1 h-12 w-full rounded object-contain" />
        )}
        {file && !previewUrl ? (
          <CheckCircle2 className="text-chart-2 h-6 w-6" />
        ) : !previewUrl ? (
          <Icon className="text-muted-foreground h-6 w-6" />
        ) : null}
        <p className="text-foreground text-center text-[11px] leading-tight font-semibold">
          {label}
        </p>
        <p className="text-muted-foreground/60 text-center text-[10px]">{labelEn}</p>
        {file ? (
          <p className="text-chart-2 max-w-full truncate px-2 text-center text-[10px]">
            ✓ {file.name}
          </p>
        ) : (
          <span className="text-muted-foreground/60 flex items-center gap-1 text-[10px]">
            <Upload className="h-3 w-3" /> ចុច ឬ អូស
          </span>
        )}
        {file && (
          <button
            type="button"
            aria-label={`Remove ${labelEn}`}
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 absolute top-1.5 right-1.5 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.target.value = '';
          }}
        />
      </div>
      <p className="text-muted-foreground/40 text-center font-mono text-[9px] select-all">
        {slotId}
      </p>
      {error && <p className="text-destructive text-center text-xs">{error}</p>}
    </div>
  );
}

// ─── PersonalInfoStep ─────────────────────────────────────────

export function PersonalInfoStep({ formData, setFields, errors, onNext, clearErrors }: StepProps) {
  const sessionKey = `${formData.eventId || 'evt'}_${formData.organizationId || 'org'}`;
  const { textDraft, photos, photosLoaded, setTextField, setPhotoSlot, getSlotId } =
    usePersonalInfoDraft(sessionKey);

  const isAthlete = textDraft.role === 'Athlete';
  const isLeader = textDraft.role === 'Leader';

  const sync = useCallback(
    (patch: Parameters<typeof setTextField>[0]) => {
      setTextField(patch);
      setFields(patch);
      if (clearErrors) clearErrors(Object.keys(patch) as (keyof RegistrationFormData)[]);
    },
    [setTextField, setFields, clearErrors]
  );

  const handleGenderChange = useCallback(
    (v: string) => {
      const patch: Parameters<typeof setTextField>[0] = {
        gender: v as Gender,
        athleteCategory: v as AthleteCategory,
      };
      if (isAthlete) patch.athleteCategory = v as AthleteCategory;
      sync(patch);
    },
    [sync, isAthlete]
  );

  const handleLeaderRoleChange = useCallback(
    (value: string) => {
      sync({ role: 'Leader', leaderRole: value as LeaderRole, athleteCategory: '' });
    },
    [sync]
  );

  const handleAthleteSelect = useCallback(() => {
    sync({ role: 'Athlete', leaderRole: '', athleteCategory: textDraft.gender as AthleteCategory });
  }, [sync, textDraft.gender]);

  const handleClearRole = useCallback(() => {
    sync({ role: '', leaderRole: '', athleteCategory: '' });
  }, [sync]);

  const handlePhoto = useCallback(
    async (key: PhotoSlotKey, file: File | null) => {
      await setPhotoSlot(key, file);
      setFields({ [key]: file });
      if (file && clearErrors) clearErrors([key]);
    },
    [setPhotoSlot, setFields, clearErrors]
  );

  const canProceed =
    !!textDraft.firstNameKhmer ||
    !!textDraft.lastNameKhmer ||
    !!textDraft.firstNameLatin ||
    !!textDraft.lastNameLatin;

  return (
    <div className="space-y-5">
      <StepHeader title="ព័ត៌មានផ្ទាល់ខ្លួន" subtitle="បំពេញព័ត៌មានអ្នកចូលរួម" />

      {/* ── Names ──────────────────────────────────────────── */}
      <SectionCard title="ឈ្មោះ">
        <Grid cols={2}>
          <Field label="គោត្តនាម" error={errors.lastNameKhmer}>
            <Input
              placeholder="គោត្តនាម"
              value={textDraft.lastNameKhmer}
              onChange={(e) => sync({ lastNameKhmer: e.target.value })}
            />
          </Field>
          <Field label="គោត្តនាម (ឡាតាំង)" error={errors.lastNameLatin}>
            <Input
              placeholder="Family name"
              value={textDraft.lastNameLatin}
              onChange={(e) => sync({ lastNameLatin: e.target.value })}
            />
          </Field>
          <Field label="នាម" error={errors.firstNameKhmer}>
            <Input
              placeholder="នាម"
              value={textDraft.firstNameKhmer}
              onChange={(e) => sync({ firstNameKhmer: e.target.value })}
            />
          </Field>
          <Field label="នាម (ឡាតាំង)" error={errors.firstNameLatin}>
            <Input
              placeholder="Given name"
              value={textDraft.firstNameLatin}
              onChange={(e) => sync({ firstNameLatin: e.target.value })}
            />
          </Field>
        </Grid>
      </SectionCard>


      {/* ── Contact & DOB ──────────────────────────────────── */}
      <SectionCard title="កំណើត និង ទំនាក់ទំនង">
        <Grid cols={2}>
          <Field label="ភេទ" error={errors.gender}>
            <NativeSelect
              value={textDraft.gender}
              onChange={handleGenderChange}
              options={GENDER_OPTIONS}
              placeholder="ជ្រើសភេទ"
            />
          </Field>
          <Field label="ថ្ងៃ ខែ ឆ្នាំកំណើត" error={errors.dateOfBirth}>
            <Input
              type="date"
              value={textDraft.dateOfBirth}
              onChange={(e) => sync({ dateOfBirth: e.target.value })}
            />
          </Field>
          <Field label="លេខអត្តសញ្ញាណ" error={errors.nationalID}>
            <Input
              placeholder="xxxxxxxxxxxxxx"
              value={textDraft.nationalID}
              onChange={(e) => sync({ nationalID: e.target.value })}
            />
          </Field>
          <Field label="ទូរស័ព្ទ" error={errors.phone}>
            <Input
              placeholder="0xx xxx xxx"
              value={textDraft.phone}
              onChange={(e) => sync({ phone: e.target.value })}
            />
          </Field>
        </Grid>
      </SectionCard>
      
      {/* ── Document selection (checkboxes) ─────────────────── */}
      <SectionCard title="ជ្រើសរើសឯកសារដែលមាន">
        <p className="text-muted-foreground mb-3 text-xs">
          គូសលើឯកសារដែលអ្នកមាន រួចបញ្ចូលឯកសារខាងក្រោម
        </p>
        <div className="grid grid-cols-2 gap-3">
          {VERIFY_DOCS.map((doc) => {
            // FIX: read from selectedDocKeys — NOT nationality
            const selectedKeys = textDraft.selectedDocKeys
              ? textDraft.selectedDocKeys.split(',')
              : [];
            const isChecked = selectedKeys.includes(doc.key);
            return (
              <label
                key={doc.key}
                className={[
                  'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
                  isChecked
                    ? 'border-primary/60 bg-primary/5'
                    : 'border-border bg-muted/50 hover:border-primary/40 hover:bg-primary/5',
                ].join(' ')}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    let next: string[];
                    if (checked) {
                      next = [...selectedKeys, doc.key];
                    } else {
                      next = selectedKeys.filter((k) => k !== doc.key);
                      handlePhoto(doc.key, null);
                    }
                    const cleanNext = next.filter(Boolean);
                    const firstIdType = (cleanNext.map((k) => DOC_KEY_TO_IDTYPE[k]).find(Boolean) ??
                      '') as IdDocType | '';
                    // FIX: write to selectedDocKeys — nationality stays as real nationality
                    sync({ selectedDocKeys: cleanNext.join(','), idDocType: firstIdType });
                  }}
                />
                <doc.Icon className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-foreground text-sm font-medium">{doc.label}</p>
                  <p className="text-muted-foreground/60 text-[10px]">{doc.labelEn}</p>
                </div>
              </label>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Role ───────────────────────────────────────────── */}
      <SectionCard title="តួនាទី">
        {errors.role && <p className="text-destructive mb-2 text-xs">{errors.role}</p>}
        <Grid cols={2}>
          <Field label="តួនាទី (អ្នកដឹកនាំ)" error={errors.leaderRole}>
            <NativeSelect
              value={isLeader ? textDraft.leaderRole : ''}
              disabled={isAthlete}
              onChange={(v) => (v ? handleLeaderRoleChange(v) : handleClearRole())}
              options={LEADER_ROLE_OPTIONS}
              placeholder="ជ្រើសតួនាទី"
            />
          </Field>
          <div className="self-end">
            <label
              className={[
                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors',
                isAthlete
                  ? 'border-primary/60 bg-primary/5'
                  : 'border-border bg-muted/50 hover:border-primary/40 hover:bg-primary/5',
              ].join(' ')}
            >
              <input
                type="radio"
                name="roleAthlete"
                checked={isAthlete}
                className="accent-primary h-4 w-4"
                onChange={() => (isAthlete ? handleClearRole() : handleAthleteSelect())}
              />
              <div>
                <p className="text-foreground text-sm font-medium">ជាកីឡាករ / កីឡាការិនី</p>
                <p className="text-muted-foreground text-xs">
                  {textDraft.gender
                    ? `ប្រភេទ: ${textDraft.gender === 'Male' ? 'ប្រុស' : 'ស្រី'}`
                    : 'ត្រូវគ្នានឹងភេទ'}
                </p>
              </div>
            </label>
          </div>
        </Grid>
      </SectionCard>

      {/* ── Documents & Photo ──────────────────────────────── */}
      <SectionCard title="ឯកសារ និង រូបថត">
        {!photosLoaded ? (
          <div className="grid grid-cols-2 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted h-30 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex gap-5">
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <p className="text-muted-foreground text-xs font-semibold">
                រូបថត ៤×៦ <span className="text-destructive">*</span>
              </p>
              <PortraitUpload
                file={photos.photoUpload}
                slotId={getSlotId('photoUpload')}
                onFile={(f) => handlePhoto('photoUpload', f)}
                error={errors.photoUpload}
              />
            </div>

            {(() => {
              // FIX: read from selectedDocKeys — NOT nationality
              const selectedKeys = textDraft.selectedDocKeys
                ? textDraft.selectedDocKeys.split(',')
                : [];
              const selectedDocs = VERIFY_DOCS.filter((d) => selectedKeys.includes(d.key));
              if (selectedDocs.length === 0)
                return (
                  <div className="border-border bg-muted/50 flex flex-1 items-center justify-center rounded-xl border-2 border-dashed p-6">
                    <p className="text-muted-foreground text-center text-sm">
                      សូមគូសជ្រើសរើសឯកសារខាងលើជាមុនសិន
                    </p>
                  </div>
                );
              return (
                <div className="flex-1">
                  <p className="text-muted-foreground mb-2 text-xs font-semibold">
                    ឯកសារផ្ទៀងផ្ទាត់{' '}
                    <span className="text-muted-foreground/60 font-normal">
                      ({selectedDocs.length} ឯកសារ)
                    </span>
                  </p>
                  <div
                    className={`grid gap-3 ${selectedDocs.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
                  >
                    {selectedDocs.map((doc) => (
                      <DocUploadSlot
                        key={doc.key}
                        label={doc.label}
                        labelEn={doc.labelEn}
                        Icon={doc.Icon}
                        slotId={getSlotId(doc.key)}
                        file={photos[doc.key]}
                        onFile={(f) => handlePhoto(doc.key, f)}
                        error={errors[doc.key]}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </SectionCard>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="sticky bottom-4 z-10">
        <SectionCard className="backdrop-blur-sm">
          <ActionFooter
            showBack={false}
            onNext={onNext}
            nextLabel="បន្តទៅការពិនិត្យ"
            nextDisabled={!canProceed}
          />
        </SectionCard>
      </div>
    </div>
  );
}
