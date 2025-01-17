'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface CardWrapperProps {
	children: React.ReactNode;
	className?: string;
}

export function CardWrapper({ children, className }: CardWrapperProps) {
	return (
		<Card className="relative overflow-hidden border bg-card/50 shadow-sm backdrop-blur-sm">
			<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
			<div className="relative p-6 space-y-6">{children}</div>
		</Card>
	);
}
