'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

interface DigestData {
	date: string;
	views: number;
}

interface DailyDigestGraphProps {
	data: DigestData[];
}

const chartConfig = {
	views: {
		label: 'Views',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

export function DailyDigestGraph({ data }: DailyDigestGraphProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Daily Digest Views</CardTitle>
				<CardDescription>
					Number of users who opened their daily digest
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[200px]">
					<AreaChart data={data}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							type="monotone"
							dataKey="views"
							stroke="var(--color-views)"
							fill="var(--color-views)"
							fillOpacity={0.2}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
