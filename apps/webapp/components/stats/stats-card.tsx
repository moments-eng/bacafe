import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardProps {
	title: string;
	value: number | string;
	description?: string;
	icon?: React.ReactNode;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	className?: string;
	isLoading?: boolean;
}

export function StatsCard({
	title,
	value,
	description,
	icon,
	trend,
	className,
	isLoading,
}: StatsCardProps) {
	return (
		<Card className={cn('', className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				{isLoading ? (
					<Skeleton className="h-6 w-1/2" />
				) : (
					<CardTitle className="text-sm font-medium">{title}</CardTitle>
				)}
				{icon && <div className="text-muted-foreground">{icon}</div>}
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className="h-8 w-1/4" />
				) : (
					<div className="text-2xl font-bold">{value}</div>
				)}
				{description && (
					<CardDescription className="mt-2">{description}</CardDescription>
				)}
				{trend && (
					<p
						className={cn(
							'mt-2 text-xs',
							trend.isPositive ? 'text-green-600' : 'text-red-600',
						)}
					>
						{trend.isPositive ? '↑' : '↓'} {trend.value}% from last period
					</p>
				)}
			</CardContent>
		</Card>
	);
}
