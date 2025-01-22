'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Line, LineChart } from 'recharts';

interface DataPoint {
	date: string;
	signups: number;
}

interface UsersSignupGraphProps {
	data: DataPoint[];
}

const chartConfig = {
	signups: {
		label: 'Signups',
		color: 'hsl(var(--chart-1))',
	},
} as const;

export function UsersSignupGraph({ data }: UsersSignupGraphProps) {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>User Signups Over Time</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[200px]">
					<LineChart data={data}>
						<Line
							type="monotone"
							dataKey="signups"
							strokeWidth={2}
							activeDot={{ r: 8 }}
						/>
						<ChartTooltip />
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
