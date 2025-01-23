'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createFeed } from '@/app/admin/feeds/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queries';

const formSchema = z.object({
	provider: z.string().min(2, 'Provider must be at least 2 characters'),
	url: z.string().url('Invalid RSS URL'),
	categories: z
		.string()
		.transform((val) => val.split(',').map((s) => s.trim())),
});

export function CreateFeedDialog({ onSuccess }: { onSuccess?: () => void }) {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			provider: '',
			url: '',
			categories: [],
		},
	});

	const { mutate } = useMutation({
		mutationFn: createFeed,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to create feed',
				variant: 'destructive',
			});
		},
	});

	const handleSubmit = (data: z.infer<typeof formSchema>) => {
		const formData = new FormData();
		formData.append('provider', data.provider);
		formData.append('url', data.url);
		formData.append('categories', JSON.stringify(data.categories));
		mutate(formData);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">
					<PlusCircle className="mr-2 h-4 w-4" />
					Add New Feed
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create New RSS Feed</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="provider"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Provider</FormLabel>
									<FormControl>
										<Input placeholder="ynet" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>RSS URL</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/rss.xml"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="categories"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Categories (comma separated)</FormLabel>
									<FormControl>
										<Input placeholder="news, technology" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-4">
							<Button type="submit">Create Feed</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
