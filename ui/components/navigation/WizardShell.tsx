/**
 * WizardShell — shared layout/logic wrapper for all multi-step wizards.
 *
 * Eliminates the ~50 lines of duplicated AnimatePresence + error banner +
 * nav buttons boilerplate from RegistrationWizard, ByNumberWizard, and SurveyWizard.
 *
 * @example
 * <WizardShell
 *   sidebar={<RegistrationSidebar ... />}
 *   activeIndex={wizard.activeIndex}
 *   errors={errors}
 *   hideNav={wizard.activeIndex >= 4}
 *   onPrev={wizard.prevStep}
 *   onNext={() => attemptNext()}
 *   prevDisabled={wizard.activeIndex === 0}
 *   className="min-h-[80vh]"
 * >
 *   {renderStep()}
 * </WizardShell>
 */

'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/design-system/primitives/Button';
import { ErrorBanner } from '@/ui/components/feedback';

// ── Types ─────────────────────────────────────────────────────

interface WizardShellProps {
  /** Sidebar component (rendered in the left column) */
  sidebar: React.ReactNode;
  /** Current active step index (used as motion key) */
  activeIndex: number;
  /** Error object — banner shown when non-empty */
  errors: Record<string, any>;
  /** Error banner message (defaults to generic Khmer text) */
  errorMessage?: string;
  /** Hide the bottom prev/next buttons */
  hideNav?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  /** Outer wrapper className (e.g. "min-h-[80vh]") */
  className?: string;
  /** Content wrapper className */
  contentClassName?: string;
  children: React.ReactNode;
}

// ── Animation presets ─────────────────────────────────────────

const variants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const transition = { type: 'tween' as const, duration: 0.3, ease: 'easeInOut' as const };

// ── Component ─────────────────────────────────────────────────

export function WizardShell({
  sidebar,
  activeIndex,
  errors,
  errorMessage = 'សូមបំពេញព័ត៌មានដែលខ្វះ',
  hideNav = false,
  onPrev,
  onNext,
  prevDisabled,
  prevLabel = 'ត្រលប់',
  nextLabel = 'បន្ត',
  className,
  contentClassName,
  children,
}: WizardShellProps) {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className={cn('flex', className)}>
      {sidebar}

      <div className={cn('flex-1 overflow-y-auto p-6', contentClassName)}>
        {hasErrors && <ErrorBanner message={errorMessage} />}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {!hideNav && (
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={onPrev} disabled={prevDisabled}>
              {prevLabel}
            </Button>
            <Button onClick={onNext} className="px-8">
              {nextLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
