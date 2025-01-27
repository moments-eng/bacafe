"use client";

import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import { useOnboardingStore } from "@/stores/onboarding";
import { AnimatePresence, motion } from "framer-motion";
import { ContentMatchingStep } from "./steps/content-matching-step";
import { PersonalDetailsStep } from "./steps/personal-details-step";
import { SuccessStep } from "./steps/success-step";
import { TimePreferenceStep } from "./steps/time-preference-step";
import { DigestChannelStep } from "./steps/digest-channel-step";

const { onboarding } = hebrewContent;

interface Step {
  id: 1 | 2 | 3 | 4 | 5;
  component: React.FC;
  header: string;
  subheader: string;
}

const steps: Step[] = [
  {
    id: 1,
    component: ContentMatchingStep,
    header: onboarding.steps[2].header,
    subheader: onboarding.steps[2].subheader,
  },
  {
    id: 2,
    component: PersonalDetailsStep,
    header: onboarding.steps[1].header,
    subheader: onboarding.steps[1].subheader,
  },
  {
    id: 3,
    component: TimePreferenceStep,
    header: onboarding.steps[3].header,
    subheader: onboarding.steps[3].subheader,
  },
  {
    id: 4,
    component: DigestChannelStep,
    header: onboarding.steps[4].header,
    subheader: onboarding.steps[4].subheader,
  },
  {
    id: 5,
    component: SuccessStep,
    header: "",
    subheader: "",
  },
];

export default function OnboardingPage() {
  const { currentStep, previousStep } = useOnboardingStore();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-start justify-center p-4">
        <div className="w-full max-w-2xl space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {steps.map(
                ({ id, component: StepComponent }) =>
                  currentStep === id && <StepComponent key={id} />
              )}
            </motion.div>
          </AnimatePresence>

          {currentStep > 1 && currentStep !== 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-end"
            >
              <Button
                variant="ghost"
                onClick={previousStep}
                className="group text-sm"
                size="sm"
              >
                {onboarding.buttons.back} →
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
