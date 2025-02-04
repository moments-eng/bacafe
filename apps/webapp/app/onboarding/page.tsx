"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { ContentMatchingStep } from "./steps/content-matching-step";
import { DigestChannelStep } from "./steps/digest-channel-step";
import { LoginStep } from "./steps/login-step";
import { PersonalDetailsStep } from "./steps/personal-details-step";
import { TimePreferenceStep } from "./steps/time-preference-step";
import { OnboardingStep, useOnboardingStore } from "./store/onboarding-store";

const stepComponents: Record<OnboardingStep, React.ComponentType> = {
  [OnboardingStep.ContentMatching]: ContentMatchingStep,
  [OnboardingStep.PersonalDetails]: PersonalDetailsStep,
  [OnboardingStep.TimePreference]: TimePreferenceStep,
  [OnboardingStep.DigestChannel]: DigestChannelStep,
  [OnboardingStep.Login]: LoginStep,
};

export default function OnboardingPage() {
  const { step } = useOnboardingStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.isOnboardingDone) {
      redirect("/dashboard");
    }
  }, [session]);

  const renderStep = () => {
    const StepComponent = stepComponents[step] || ContentMatchingStep;
    return <StepComponent />;
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-md mx-auto px-4 py-8">{renderStep()}</div>
    </main>
  );
}
