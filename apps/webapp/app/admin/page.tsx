'use client';

import { DailyDigestGraph } from '@/components/admin/dashboard/daily-digest-graph';
import { UsersSignupGraph } from '@/components/admin/dashboard/users-signup-graph';
import { StatsCard } from '@/components/stats/stats-card';
import type { ChartConfig } from '@/components/ui/chart';
import { Clock, Eye, FileText, UserPlus, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

// This would come from your API
const mockData = {
	totalUsers: 1234,
	newUsersToday: 25,
	pendingApprovals: 12,
	dailyDigestViews: 890,
	digestsSent: 1200,
	articlesProcessed: 156,
	signupData: [
		{ date: 'Mon', signups: 12 },
		{ date: 'Tue', signups: 18 },
		{ date: 'Wed', signups: 15 },
		{ date: 'Thu', signups: 25 },
		{ date: 'Fri', signups: 20 },
	],
	digestData: [
		{ date: 'Mon', views: 234 },
		{ date: 'Tue', views: 345 },
		{ date: 'Wed', views: 289 },
		{ date: 'Thu', views: 456 },
		{ date: 'Fri', views: 390 },
	],
};

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: 'hsl(var(--chart-1))',
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

const chartData = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
];

export default function AdminPage() {
	const { data: session } = useSession();
	const user = session?.user;

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">
					Hi {user?.name}, Welcome back 👋
				</h2>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Total Users"
					value={mockData.totalUsers}
					description="Total number of registered users"
					icon={<Users className="h-4 w-4" />}
					trend={{ value: 12, isPositive: true }}
				/>
				<StatsCard
					title="New Users Today"
					value={mockData.newUsersToday}
					description="Users who signed up in the last 24 hours"
					icon={<UserPlus className="h-4 w-4" />}
					trend={{ value: 8, isPositive: true }}
				/>
				<StatsCard
					title="Pending Approvals"
					value={mockData.pendingApprovals}
					description="Users waiting for account approval"
					icon={<Clock className="h-4 w-4" />}
				/>
				<StatsCard
					title="Daily Digest Views"
					value={`${mockData.dailyDigestViews}/${mockData.digestsSent}`}
					description="Number of digests opened vs sent today"
					icon={<Eye className="h-4 w-4" />}
					trend={{ value: 5, isPositive: true }}
				/>
				<StatsCard
					title="Articles Processed"
					value={mockData.articlesProcessed}
					description="Articles processed for today's digest"
					icon={<FileText className="h-4 w-4" />}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<DailyDigestGraph data={mockData.digestData} />
				<UsersSignupGraph data={mockData.signupData} />
			</div>
		</div>
	);
}
