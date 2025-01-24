'use client';

import { DailyDigestGraph } from '@/components/admin/dashboard/daily-digest-graph';
import { UsersSignupGraph } from '@/components/admin/dashboard/users-signup-graph';
import { StatsCard } from '@/components/stats/stats-card';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { QUERY_KEYS } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';
import { Clock, Eye, FileText, Info, UserPlus, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getAdminStats } from './actions';

export default function AdminPage() {
	const { data: session } = useSession();
	const user = session?.user;

	const { data, isLoading } = useQuery({
		queryKey: [QUERY_KEYS.ADMIN_STATS],
		queryFn: () => getAdminStats(),
		refetchInterval: 300000, // Refresh every 5 minutes
	});

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-2xl font-bold">
								Hi {user?.name}, Welcome back 👋
							</CardTitle>
							<CardDescription className="mt-2">
								Platform overview and key metrics
							</CardDescription>
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Info className="h-4 w-4" />
							<span>Data updates every 5 minutes</span>
						</div>
					</div>
				</CardHeader>
			</Card>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Total Users"
					value={data?.totalUsers || 0}
					icon={<Users className="h-4 w-4" />}
					isLoading={isLoading}
				/>

				<StatsCard
					title="New Users Today"
					value={data?.newUsersToday || 0}
					description="Registered in last 24 hours"
					icon={<UserPlus className="h-4 w-4" />}
					trend={{
						value: data?.newUsersTrend || 0,
						isPositive: (data?.newUsersTrend || 0) >= 0,
					}}
					isLoading={isLoading}
				/>

				<StatsCard
					title="Pending Approvals"
					value={data?.pendingApprovals || 0}
					description="Awaiting admin approval"
					icon={<Clock className="h-4 w-4" />}
					isLoading={isLoading}
				/>

				<StatsCard
					title="Active Content"
					value={0}
					description="Processed today"
					icon={<FileText className="h-4 w-4" />}
					isLoading={isLoading}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">User Signups</CardTitle>
						<CardDescription>7-day signup trend</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-[300px] w-full" />
						) : (
							<UsersSignupGraph data={data?.signupTrend || []} />
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Content Engagement</CardTitle>
						<CardDescription>Digest performance</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-[300px] w-full" />
						) : (
							<DailyDigestGraph data={data?.digestPerformance || []} />
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
