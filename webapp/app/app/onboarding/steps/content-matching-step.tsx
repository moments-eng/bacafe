'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { hebrewContent } from '@/locales/he';
import { useOnboardingStore } from '@/stores/onboarding';
import { useState } from 'react';
import { articles } from '../onboarding-articles';
import ArticleCard from '@/components/article-card';
import { updateArticleScore } from '../actions';

const { onboarding } = hebrewContent;

export function ContentMatchingStep() {
	const { name, nextStep } = useOnboardingStore();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleSwipe = (direction: 'left' | 'right') => {
		if (isAnimating) return;

		setIsAnimating(true);

		// Fire and forget - update score in background
		updateArticleScore(
			articles[currentIndex].id,
			direction === 'right' ? 1 : -1,
		);

		if (currentIndex >= articles.length - 1) {
			setTimeout(() => {
				setIsAnimating(false);
				nextStep();
			}, 100);
		} else {
			setTimeout(() => {
				setCurrentIndex((prev) => prev + 1);
				setIsAnimating(false);
			}, 100);
		}
	};

	const progress = ((currentIndex + 1) / articles.length) * 100;

	return (
		<div className="space-y-4">
			<h3 className="font-medium text-lg">
				{onboarding.steps.interests.title} {name}?
			</h3>
			<p className="text-sm text-muted-foreground">
				{onboarding.steps.interests.description}
			</p>
			<div className="w-full max-w-sm mb-4">
				<Progress value={progress} className="w-full" />
			</div>

			<div className="w-full max-w-sm relative h-[500px]">
				<div className="relative w-full h-full">
					<ArticleCard
						key={currentIndex}
						article={articles[currentIndex]}
						onSwipe={handleSwipe}
					/>
				</div>
			</div>
		</div>
	);
}
