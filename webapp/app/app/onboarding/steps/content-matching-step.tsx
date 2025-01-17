'use client';

import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboarding';
import { hebrewContent } from '@/locales/he';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { markOnboardingDone, updateUser } from '../actions';
import { useRouter } from 'next/navigation';

const { onboarding } = hebrewContent;

const interests = [
	{ id: 'tech', label: onboarding.steps.interests.topics.tech },
	{ id: 'health', label: onboarding.steps.interests.topics.health },
	{ id: 'food', label: onboarding.steps.interests.topics.food },
	{ id: 'art', label: onboarding.steps.interests.topics.art },
	{ id: 'music', label: onboarding.steps.interests.topics.music },
	{ id: 'travel', label: onboarding.steps.interests.topics.travel },
];

export function ContentMatchingStep() {
	const { name, nextStep } = useOnboardingStore();
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
	const [error, setError] = useState<string>();
	const router = useRouter();

	const toggleInterest = (id: string) => {
		setSelectedInterests((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handleContinue = async () => {
		if (selectedInterests.length < 3) return;

		const result = await updateUser({
			interests: selectedInterests,
		});

		if (result.success) {
			nextStep();
		}
	};

	return (
		<div className="space-y-4">
			<h3 className="font-medium text-lg">
				{onboarding.steps.interests.title} {name}?
			</h3>
			<p className="text-sm text-muted-foreground">
				{onboarding.steps.interests.description}
			</p>

			<div className="grid grid-cols-2 gap-3">
				{interests.map((interest) => (
					<Button
						key={interest.id}
						variant={
							selectedInterests.includes(interest.id) ? 'default' : 'outline'
						}
						className="h-24 relative"
						onClick={() => toggleInterest(interest.id)}
					>
						{selectedInterests.includes(interest.id) && (
							<Check className="absolute top-2 right-2 h-4 w-4" />
						)}
						<span className="text-lg">{interest.label}</span>
					</Button>
				))}
			</div>

			{error && <p className="text-sm text-destructive">{error}</p>}

			<Button
				className="w-full"
				disabled={selectedInterests.length < 3}
				onClick={handleContinue}
			>
				{onboarding.buttons.continue}
			</Button>
		</div>
	);
}
