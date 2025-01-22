import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface NavigationItem {
	title: string;
	href: string;
	icon: LucideIcon;
}

interface NavigationProps {
	items: NavigationItem[];
	variant?: 'default' | 'muted';
}

export function Navigation({ items, variant = 'default' }: NavigationProps) {
	return (
		<nav className="flex flex-col gap-1">
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground',
						variant === 'muted' && 'text-muted-foreground',
					)}
				>
					<item.icon
						className={cn('ml-3', variant === 'muted' ? 'h-4 w-4' : 'h-5 w-5')}
					/>
					<span
						className={cn(
							'flex-1 font-medium',
							variant === 'muted' ? 'text-sm' : 'text-base',
						)}
					>
						{item.title}
					</span>
				</Link>
			))}
		</nav>
	);
}
