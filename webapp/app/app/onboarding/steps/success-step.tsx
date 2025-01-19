'use client';

import { Button } from '@/components/ui/button';
import { useContainerDimensions } from '@/hooks/use-container-dimensions';
import { hebrewContent } from '@/locales/he';
import { useOnboardingStore } from '@/stores/onboarding';
import { motion } from 'framer-motion';
import { Mail, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Confetti from 'react-confetti';
import { updateUser } from '../actions';

const { success } = hebrewContent.onboarding;

export function SuccessStep() {
	const router = useRouter();
	const { name, digestTime } = useOnboardingStore();
	const { width, height } = useContainerDimensions();

	useEffect(() => {
		updateUser({ isOnboardingDone: true });
	}, []);

	return (
		<div className="relative p-6 space-y-6">
			<Confetti
				width={width}
				height={height}
				style={{
					position: 'fixed',
					top: -200,
					left: -200,
				}}
				numberOfPieces={500}
				recycle={false}
			/>

			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="text-center space-y-3"
			>
				<h1 className="text-3xl font-bold text-primary">{success.title}</h1>
				<p className="text-lg text-muted-foreground">{success.subtitle}</p>
			</motion.div>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="space-y-2 bg-muted/50 rounded-lg p-4"
			>
				<h2 className="text-xl font-semibold">
					{success.greeting}, {name}!
				</h2>
				<p className="text-muted-foreground">
					{success.digestTime.replace('{time}', digestTime)}
				</p>

				<div className="flex justify-center py-4">
					<Mail className="h-16 w-16 text-primary animate-bounce" />
				</div>
			</motion.div>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.4 }}
				className="space-y-4"
			>
				<Button
					className="w-full"
					size="lg"
					onClick={() => router.push('/app')}
				>
					{success.cta}
				</Button>

				<div className="space-y-2">
					<p className="text-sm text-center text-muted-foreground">
						{success.chatInvite}
					</p>
					<Button
						variant="secondary"
						className="w-full"
						size="lg"
						onClick={() => router.push('/chat')}
					>
						<MessageCircle className="mr-2 h-4 w-4" />
						{success.chatButton}
					</Button>
				</div>
			</motion.div>
		</div>
	);
}
