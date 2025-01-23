import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { formatDistanceToNow } from 'date-fns';
import { toggleFeedStatus, deleteFeed } from './actions';
import type { components } from '@/lib/http-clients/feeds/schema';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { IntervalDialog } from '@/components/admin/feeds/interval-dialog';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queries';

type FeedDto = components['schemas']['FeedDto'];

export const columns: ColumnDef<FeedDto>[] = [
	{
		accessorKey: 'provider',
		header: 'Provider',
		cell: ({ row }) => (
			<div className="font-medium">
				{row.original.provider}
				<div className="text-sm text-muted-foreground">
					{row.original.categories?.map((c: string) => (
						<Badge key={c} variant="outline" className="mr-1">
							{c}
						</Badge>
					))}
				</div>
			</div>
		),
	},
	{
		accessorKey: 'name',
		header: 'Feed Name',
	},
	{
		accessorKey: 'url',
		header: 'RSS URL',
		cell: ({ row }) => (
			<a
				href={row.original.url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary hover:underline"
			>
				{row.original.url}
			</a>
		),
	},
	{
		accessorKey: 'scrapingInterval',
		header: 'Interval',
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Clock className="h-4 w-4 text-muted-foreground" />
				<IntervalDialog
					feedId={row.original.id}
					currentInterval={row.original.scrapingInterval}
					isActive={row.original.isActive}
				/>
				<span>
					{row.original.scrapingInterval > 0
						? `${row.original.scrapingInterval}m`
						: 'Inactive'}
				</span>
			</div>
		),
	},
	{
		accessorKey: 'lastScrapedAt',
		header: 'Last Scraped',
		cell: ({ row }) =>
			row.original.lastScrapedAt
				? formatDistanceToNow(new Date(row.original.lastScrapedAt), {
						addSuffix: true,
					})
				: 'Never',
	},
	{
		accessorKey: 'isActive',
		header: 'Status',
		cell: ({ row }) => {
			const { toast } = useToast();
			const queryClient = useQueryClient();

			const { mutate } = useMutation({
				mutationFn: (checked: boolean) =>
					toggleFeedStatus(row.original.id, checked),
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
				},
				onError: (error) => {
					toast({
						title: 'Error',
						description:
							error instanceof Error
								? error.message
								: 'Failed to update status',
						variant: 'destructive',
					});
				},
			});

			return (
				<div className="flex items-center gap-2">
					<Switch
						checked={row.original.isActive}
						onCheckedChange={(checked) => mutate(checked)}
					/>
					<Badge variant={row.original.isActive ? 'default' : 'secondary'}>
						{row.original.isActive ? 'Active' : 'Paused'}
					</Badge>
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { toast } = useToast();
			const queryClient = useQueryClient();

			const { mutate } = useMutation({
				mutationFn: () => deleteFeed(row.original.id),
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
				},
				onError: (error) => {
					toast({
						title: 'Error',
						description:
							error instanceof Error ? error.message : 'Failed to delete feed',
						variant: 'destructive',
					});
				},
			});

			return (
				<div className="flex justify-end">
					<Button variant="ghost" size="sm" onClick={() => mutate()}>
						<Trash2 className="h-4 w-4 text-destructive" />
					</Button>
				</div>
			);
		},
	},
];
