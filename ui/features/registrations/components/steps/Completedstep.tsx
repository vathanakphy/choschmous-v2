'use client';

import { CheckCircle2, Trophy, Medal, Hash, Building2, UserPlus, Home } from 'lucide-react';
import { Button } from '@/ui/design-system/primitives/Button';
import type { RegistrationFormData } from '@/ui/features/registrations/types/Registration.types';

// ─── Props ────────────────────────────────────────────────────

interface CompletedStepProps {
  formData: RegistrationFormData;
  enrollId: number | null;
  onAddMore: () => void;
  onGoHome: () => void;
}

// ─── Component ────────────────────────────────────────────────

export function CompletedStep({ formData, enrollId, onAddMore, onGoHome }: CompletedStepProps) {
  const displayName = formData.fullNameKhmer || formData.fullNameEnglish || 'អ្នកចូលរួម';

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SuccessHeader displayName={displayName} enrollId={enrollId} />
      <RegistrationSummary formData={formData} displayName={displayName} />
      <AddMoreSection onAddMore={onAddMore} />

      <div className="flex justify-center">
        <Button variant="outline" size="lg" onClick={onGoHome} className="min-w-44">
          <Home className="h-4 w-4" />
          ទំព័រដើម
        </Button>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function SuccessHeader({
  displayName,
  enrollId,
}: {
  displayName: string;
  enrollId: number | null;
}) {
  return (
    <div className="space-y-4 py-8 text-center">
      <div className="flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-(--reg-emerald-50)">
          <CheckCircle2 className="text-chart-2 h-12 w-12" />
        </div>
      </div>
      <h2 className="text-chart-2 text-3xl font-bold">បានចុះឈ្មោះដោយជោគជ័យ!</h2>
      <p className="text-muted-foreground">
        <span className="text-foreground font-semibold">{displayName}</span> បានចុះឈ្មោះរួចរាល់
      </p>
      {enrollId && (
        <p className="text-muted-foreground text-sm">
          លេខសម្គាល់: <span className="font-mono font-semibold">#{enrollId}</span>
        </p>
      )}
    </div>
  );
}

function RegistrationSummary({
  formData,
  displayName,
}: {
  formData: RegistrationFormData;
  displayName: string;
}) {
  const pills: { icon: React.ReactNode; label: string }[] = [
    {
      icon: <Medal className="h-3.5 w-3.5 text-(--reg-emerald-600)" />,
      label: formData.sportName || '—',
    },
    {
      icon: <Hash className="h-3.5 w-3.5 text-(--reg-emerald-600)" />,
      label: formData.categoryName || '—',
    },
    {
      icon: <Building2 className="h-3.5 w-3.5 text-(--reg-emerald-600)" />,
      label: formData.organizationName || '—',
    },
  ];

  return (
    <div className="rounded-2xl border border-(--reg-emerald-100) bg-(--reg-emerald-50) p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--reg-emerald-100) text-(--reg-emerald-700)">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-(--reg-emerald-700) uppercase">
            សង្ខេបការចុះឈ្មោះ
          </p>
          <p className="text-foreground text-lg font-semibold">{displayName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {pills.map(({ icon, label }) => (
          <span
            key={label}
            className="bg-card/80 text-foreground inline-flex items-center gap-1.5 rounded-full border border-(--reg-emerald-100) px-3 py-1.5 text-xs font-medium"
          >
            {icon}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AddMoreSection({ onAddMore }: { onAddMore: () => void }) {
  return (
    <div className="border-primary/20 bg-primary/5 space-y-4 rounded-xl border p-6 text-center">
      <h3 className="text-foreground font-semibold">ចង់ចុះឈ្មោះអ្នកផ្សេងទៀតទេ?</h3>
      <Button onClick={onAddMore} size="lg">
        <UserPlus className="h-5 w-5" />
        ចុះឈ្មោះអ្នកបន្ថែម
      </Button>
    </div>
  );
}
