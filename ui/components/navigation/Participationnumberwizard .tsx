// 'use client';

// import { useState, useCallback, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Calendar, Building2, Trophy, Hash } from 'lucide-react';
// import type { LucideIcon } from 'lucide-react';
// import { useStepWizard } from '@/ui/components/navigation/useStepWizard';
// import { WizardShell } from '@/ui/components/navigation/WizardShell';
// import { ParticipationNumberSidebar } from './ParticipationNumberSidebar';
// import {
//   useParticipationNumber,
//   validateParticipationNumberStep,
// } from '../hooks/useParticipationNumber';
// import type { ParticipationNumberErrors } from '../types/ParticipationNumber.types';
// import { ParticipationEventStep } from '../steps/ParticipationEventStep';
// import { ParticipationOrgStep } from '../steps/ParticipationOrgStep';
// import { ParticipationSportStep } from '../steps/ParticipationSportStep';
// import { ParticipationCountStep } from '../steps/ParticipationCountStep';

// const ICONS: LucideIcon[] = [Calendar, Building2, Trophy, Hash];
// const LABELS = ['ព្រឹត្តិការណ៍', 'ខេត្ត / ស្ថាប័ន', 'ប្រភេទកីឡា', 'ចំនួនប្រតិភូ'];
// const STEP_KEYS = ['event', 'organization', 'sport', 'count'];

// interface ParticipationNumberWizardProps {
//   /** Base path so we can work from both /admin and /superadmin */
//   basePath: string;
// }

// export function ParticipationNumberWizard({ basePath }: ParticipationNumberWizardProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const stepParam = searchParams.get('step');
//   const initialStep = stepParam ? Math.max(STEP_KEYS.indexOf(stepParam), 0) : 0;

//   const { formData, setFields, reset } = useParticipationNumber();
//   const [errors, setErrors] = useState<ParticipationNumberErrors>({});

//   const steps = LABELS.map((label, i) => ({
//     key: STEP_KEYS[i],
//     label,
//     icon: ICONS[i],
//     component: null as any,
//   }));

//   const handleStepChange = useCallback(
//     (index: number) => {
//       router.replace(`${basePath}/participation/number?step=${STEP_KEYS[index]}`, {
//         scroll: false,
//       });
//     },
//     [router, basePath]
//   );

//   const wizard = useStepWizard(steps, initialStep, handleStepChange);

//   useEffect(() => {
//     const param = searchParams.get('step');
//     const idx = param ? STEP_KEYS.indexOf(param) : 0;
//     if (idx !== -1 && idx !== wizard.activeIndex) wizard.goToStep(idx);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchParams]);

//   const attemptNext = useCallback(
//     (override?: Partial<typeof formData>) => {
//       const merged = override ? { ...formData, ...override } : formData;
//       const errs = validateParticipationNumberStep(wizard.activeIndex, merged);
//       if (Object.keys(errs).length) {
//         setErrors(errs);
//         return;
//       }
//       setErrors({});
//       wizard.nextStep();
//     },
//     [wizard, formData]
//   );

//   const goToStep = useCallback(
//     (idx: number) => {
//       setErrors({});
//       wizard.goToStep(idx);
//     },
//     [wizard]
//   );

//   const renderStep = () => {
//     switch (wizard.activeIndex) {
//       case 0:
//         return (
//           <ParticipationEventStep
//             eventId={formData.eventId}
//             eventName={formData.eventName}
//             error={errors.eventId}
//             onSelect={(fields) => {
//               setFields(fields);
//               attemptNext(fields);
//             }}
//           />
//         );
//       case 1:
//         return (
//           <ParticipationOrgStep
//             eventId={formData.eventId}
//             organizationId={formData.organizationId}
//             error={errors.organizationId}
//             onSelect={(fields) => {
//               setFields(fields);
//               attemptNext(fields);
//             }}
//           />
//         );
//       case 2:
//         return (
//           <ParticipationSportStep
//             eventId={formData.eventId}
//             sportId={formData.sportId}
//             error={errors.sportId}
//             onSelect={(fields) => {
//               setFields(fields);
//               attemptNext(fields);
//             }}
//           />
//         );
//       case 3:
//         return (
//           <ParticipationCountStep
//             formData={formData}
//             setFields={setFields}
//           />
//         );
//     }
//   };

//   // Last step has its own save action; hide the generic next button
//   const hideNav = wizard.activeIndex === 3;

//   return (
//     <WizardShell
//       sidebar={
//         <ParticipationNumberSidebar
//           steps={wizard.stepsWithState.map((s, i) => ({ ...s, icon: ICONS[i] }))}
//           activeIndex={wizard.activeIndex}
//           gotoStep={goToStep}
//         />
//       }
//       activeIndex={wizard.activeIndex}
//       errors={errors}
//       hideNav={hideNav}
//       onPrev={wizard.prevStep}
//       onNext={() => attemptNext()}
//       prevDisabled={wizard.activeIndex === 0}
//       className="reg-split-layout min-h-[80vh]"
//       contentClassName="reg-content"
//     >
//       {renderStep()}
//     </WizardShell>
//   );
// }