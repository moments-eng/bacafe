'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { hebrewContent } from '@/locales/he';
import { useOnboardingStore } from '@/stores/onboarding';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { articles } from '../onboarding-articles';
import ArticleCard from '@/components/article-card';
import { updateArticleScore } from '../actions';

const { onboarding } = hebrewContent;

export function ContentMatchingStep() {
	const { name, nextStep } = useOnboardingStore();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
		null,
	);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleSwipe = async (direction: 'left' | 'right') => {
		if (isAnimating) return;

		setIsAnimating(true);
		setSwipeDirection(direction);

		// Update the article score
		const score = direction === 'right' ? 1 : -1;
		await updateArticleScore(articles[currentIndex].id, score);

		if (currentIndex >= articles.length - 1) {
			// If this is the last article, move to next step
			setTimeout(() => {
				setSwipeDirection(null);
				setIsAnimating(false);
				nextStep();
			}, 100);
		} else {
			// Otherwise, show next article
			setTimeout(() => {
				setCurrentIndex((prev) => prev + 1);
				setSwipeDirection(null);
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

				{swipeDirection === 'left' && (
					<div className="absolute inset-y-0 left-0 flex items-center justify-center w-16 bg-red-500 bg-opacity-50 rounded-l-lg animate-fadeOut">
						<ArrowLeft className="text-white" size={32} />
					</div>
				)}
				{swipeDirection === 'right' && (
					<div className="absolute inset-y-0 right-0 flex items-center justify-center w-16 bg-green-500 bg-opacity-50 rounded-r-lg animate-fadeOut">
						<ArrowRight className="text-white" size={32} />
					</div>
				)}
			</div>
		</div>
	);
}
