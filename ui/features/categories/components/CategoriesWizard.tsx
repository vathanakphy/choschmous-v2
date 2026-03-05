'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStepWizard } from '@/ui/components/navigation/useStepWizard';
import { WizardShell } from '@/ui/components/navigation/WizardShell';
import { useCategories, validateStep } from '../hooks/useCategories';
import type { CategoriesErrors } from '../hooks/useCategories';
import { EventTypeStep, EventStep, SportStep, SubSportStep } from '@/ui/features/categories/components/steps';

interface Event {
    id: string;
    name: string;
    name_kh?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
}


const STEP_KEYS = ['event-type', 'event', 'sport', 'subsport'] as const;

export function CategoriesWizard({
    role,          // <-- add this
    events,
    eventsLoading,
}: {
    role: 'admin' | 'superadmin';
    events: Event[];
    eventsLoading?: boolean;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const STEP_ROUTES = (() => {
        if (role === 'superadmin') {
            return [
                '/superadmin/categories?step=event-type',
                '/superadmin/categories?step=event',
                '/superadmin/categories?step=sport',
                '/superadmin/categories?step=subsport'
            ] as const;
        } else {
            return [
                '/admin/categories?step=event-type',
                '/admin/categories?step=event',
                '/admin/categories?step=sport',
                '/admin/categories?step=subsport'
            ] as const;
        }
    })();

    // Derive initial step index from ?step= URL param
    const stepParam = searchParams.get('step');
    const initialStep = stepParam ? Math.max(STEP_KEYS.indexOf(stepParam as any), 0) : 0;

    const { formData, setFields, resetForm, isHydrated } = useCategories();
    const [errors, setErrors] = useState<CategoriesErrors>({});

    const steps = ['ប្រភេទព្រឹត្តិការណ៍', 'ព្រឹត្តិការណ៍', 'កីឡា', 'វិញ្ញាសារ'].map((label, i) => ({
        key: STEP_KEYS[i],
        label,
        component: null as any,
    }));

    // Sync URL whenever the active step changes
    const handleStepChange = useCallback(
        (index: number) => {
            router.replace(STEP_ROUTES[index], { scroll: false });
        },
        [router]
    );

    const wizard = useStepWizard(steps, initialStep, handleStepChange);

    // If user navigates back/forward in browser, sync wizard to URL
    useEffect(() => {
        if (!isHydrated) return;

        const param = searchParams.get('step');
        const idx = param ? STEP_KEYS.indexOf(param as any) : -1;

        // Only jump to a step if URL explicitly specifies it
        if (idx !== -1 && idx !== wizard.activeIndex) {
            wizard.goToStep(idx);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, isHydrated]);

    const attemptNext = useCallback(
        (override?: any) => {
            const merged = override ? { ...formData, ...override } : formData;
            const errs = validateStep(wizard.activeIndex, merged);
            if (Object.keys(errs).length) {
                setErrors(errs);
                return;
            }
            setErrors({});
            wizard.nextStep();
        },
        [wizard, formData]
    );

    const renderStep = () => {
        const p = { formData, setFields, errors, onNext: attemptNext };
        switch (wizard.activeIndex) {
            case 0:
                return <EventTypeStep {...p} events={events} loading={eventsLoading} />;
            case 1:
                return <EventStep {...p} events={events} loading={eventsLoading} />;
            case 2:
                return <SportStep {...p} />;
            case 3:
                return <SubSportStep {...p} />;
        }
    };

    if (!isHydrated) {
        return <div className="flex items-center justify-center min-h-[80vh]">Loading...</div>;
    }

    return (
        <WizardShell
            sidebar={null}
            activeIndex={wizard.activeIndex}
            errors={errors}
            hideNav={false}
            onPrev={wizard.prevStep}
            onNext={() => attemptNext()}
            prevDisabled={wizard.activeIndex === 0}
            className="min-h-[80vh]"
            contentClassName="w-full"
        >
            {renderStep()}
        </WizardShell>
    );
}
