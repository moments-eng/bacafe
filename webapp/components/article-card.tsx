'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Article } from '@/types/article';
import {
	Sparkles,
	ThumbsDownIcon,
	ThumbsUpIcon,
	HeartOff,
} from 'lucide-react';
import { animated, useSpring } from 'react-spring';
import { useSwipeable } from 'react-swipeable';

interface ArticleCardProps {
	article: Article;
	onSwipe: (direction: 'left' | 'right') => void;
}

export default function ArticleCard({ article, onSwipe }: ArticleCardProps) {
	const [{ x, rot, scale }, api] = useSpring(() => ({
		x: 0,
		rot: 0,
		scale: 1,
		config: { tension: 300, friction: 20 },
	}));

	const handlers = useSwipeable({
		onSwiping: ({ deltaX }) => {
			api.start({
				x: deltaX,
				rot: deltaX / 100,
				scale: 1,
			});
		},
		onSwipedLeft: () => {
			api.start({
				x: -500,
				rot: -20,
				scale: 0.5,
				config: { duration: 150 },
				onRest: () => {
					onSwipe('left');
				},
			});
		},
		onSwipedRight: () => {
			api.start({
				x: 500,
				rot: 20,
				scale: 0.5,
				config: { duration: 150 },
				onRest: () => {
					onSwipe('right');
				},
			});
		},
		trackMouse: true,
		trackTouch: true,
	});

	return (
		<animated.div
			{...handlers}
			style={{
				x,
				rotate: rot,
				scale,
				touchAction: 'pan-y',
			}}
			className="absolute w-full max-w-sm origin-bottom"
		>
			<Card className="w-full">
				<CardHeader className="relative p-0 h-64">
					<img
						src={article.imageUrl}
						alt={article.title}
						className="object-cover rounded-t-lg h-full w-full"
					/>
					<Badge className="absolute top-2 left-2" variant="secondary">
						{article.category}
					</Badge>
				</CardHeader>
				<CardContent className="p-4">
					<h2 className="text-xl font-bold mb-2">{article.title}</h2>
					<p className="text-gray-600">{article.subtitle}</p>
				</CardContent>
				<CardFooter className="flex justify-between p-4 border-t gap-3">
					<Button
						variant="outline"
						size="icon"
						className={cn(
							'rounded-full w-14 h-14 transition-all duration-200',
							'border-green-200 hover:border-green-400 group',
							'border-2 hover:scale-110 hover:bg-green-50',
						)}
						onClick={() => onSwipe('right')}
					>
						<Sparkles
							className="w-7 h-7 text-green-500 group-hover:text-green-600 transition-colors"
							fill="currentColor"
						/>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className={cn(
							'rounded-full w-14 h-14 transition-all duration-200',
							'border-emerald-200 hover:border-emerald-400 group',
							'border-2 hover:scale-110 hover:bg-emerald-50',
						)}
						onClick={() => onSwipe('right')}
					>
						<ThumbsUpIcon
							className="w-7 h-7 text-emerald-500 group-hover:text-emerald-600 transition-colors"
							fill="currentColor"
						/>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className={cn(
							'rounded-full w-14 h-14 transition-all duration-200',
							'border-orange-200 hover:border-orange-400 group',
							'border-2 hover:scale-110 hover:bg-orange-50',
						)}
						onClick={() => onSwipe('left')}
					>
						<ThumbsDownIcon
							className="w-7 h-7 text-orange-500 group-hover:text-orange-600 transition-colors"
							fill="currentColor"
						/>
					</Button>

					<Button
						variant="outline"
						size="icon"
						className={cn(
							'rounded-full w-14 h-14 transition-all duration-200',
							'border-red-200 hover:border-red-400 group',
							'border-2 hover:scale-110 hover:bg-red-50',
						)}
						onClick={() => onSwipe('left')}
					>
						<HeartOff
							className="w-7 h-7 text-red-500 group-hover:text-red-600 transition-colors"
							fill="currentColor"
						/>
					</Button>
				</CardFooter>
			</Card>
		</animated.div>
	);
}
