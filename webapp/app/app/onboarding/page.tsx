'use client';

import { Button } from '@/components/ui/button';
import { hebrewContent } from '@/locales/he';
import { useOnboardingStore } from '@/stores/onboarding';
import { AnimatePresence, motion } from 'framer-motion';
import { PersonalDetailsStep } from './steps/personal-details-step';
import { ContentMatchingStep } from './steps/content-matching-step';
import { DirectionProvider } from '@radix-ui/react-direction';
import { TimePreferenceStep } from './steps/time-preference-step';
import { SuccessStep } from './steps/success-step';

const { onboarding } = hebrewContent;

interface Step {
	id: 1 | 2 | 3 | 4;
	component: React.FC;
	header: string;
	subheader: string;
}

const steps: Step[] = [
	{
		id: 1,
		component: PersonalDetailsStep,
		header: onboarding.steps[1].header,
		subheader: onboarding.steps[1].subheader,
	},
	{
		id: 2,
		component: ContentMatchingStep,
		header: onboarding.steps[2].header,
		subheader: onboarding.steps[2].subheader,
	},
	{
		id: 3,
		component: TimePreferenceStep,
		header: onboarding.steps[3].header,
		subheader: onboarding.steps[3].subheader,
	},
	{
		id: 4,
		component: SuccessStep,
		header: '',
		subheader: '',
	},
];

export default function OnboardingPage() {
	const { currentStep, previousStep } = useOnboardingStore();

	return (
		<DirectionProvider dir="rtl">
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
										currentStep === id && <StepComponent key={id} />,
								)}
							</motion.div>
						</AnimatePresence>

						{currentStep > 1 && (
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
		</DirectionProvider>
	);
}
