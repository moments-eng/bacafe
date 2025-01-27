'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { hebrewContent } from '@/locales/he';
import { useOnboardingStore } from '@/stores/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updateUser } from '../actions';

const { onboarding } = hebrewContent;
const { timePreference } = onboarding.steps;

const formSchema = z.object({
	digestTime: z.string().min(1, {
		message: timePreference.error,
	}),
});

type FormValues = z.infer<typeof formSchema>;

const timeSlots = [
	{
		id: 'morning',
		title: timePreference.morning.title,
		description: timePreference.morning.description,
		time: timePreference.morning.time,
	},
	{
		id: 'noon',
		title: timePreference.noon.title,
		description: timePreference.noon.description,
		time: timePreference.noon.time,
	},
	{
		id: 'evening',
		title: timePreference.evening.title,
		description: timePreference.evening.description,
		time: timePreference.evening.time,
	},
];

const customTimeOptions = Array.from({ length: 24 }, (_, i) => {
	const hour = i.toString().padStart(2, '0');
	return `${hour}:00`;
});

export function TimePreferenceStep() {
	const { digestTime, setDigestTime, nextStep } = useOnboardingStore();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			digestTime: digestTime || '',
		},
	});

	const onSubmit = async (values: FormValues) => {
		setIsLoading(true);
		try {
			const result = await updateUser({
				digestTime: values.digestTime,
			});

			if (result.success) {
				setDigestTime(values.digestTime);
				nextStep();
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold">{timePreference.label}</h2>
				<p className="text-sm text-muted-foreground">
					{timePreference.description}
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="digestTime"
						render={({ field }) => (
							<FormItem className="space-y-4">
								<div className="grid grid-cols-1 gap-4">
									{timeSlots.map((slot, index) => (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}
											key={slot.id}
										>
											<FormControl>
												<Button
													type="button"
													variant="outline"
													className={cn(
														'relative w-full p-4 h-auto flex flex-col items-start text-right space-y-2',
														field.value === slot.time &&
															'border-primary ring-2 ring-primary/10',
													)}
													onClick={() => field.onChange(slot.time)}
												>
													<div className="font-medium">{slot.title}</div>
													<div className="text-sm text-muted-foreground">
														{slot.description}
													</div>
													<div className="text-xs text-primary absolute left-4 top-1/2 -translate-y-1/2 font-medium">
														{slot.time}
													</div>
												</Button>
											</FormControl>
										</motion.div>
									))}
								</div>

								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-muted" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-card px-2 text-muted-foreground">
											{timePreference.custom.title}
										</span>
									</div>
								</div>

								<FormControl>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="w-full">
											<SelectValue
												placeholder={timePreference.custom.placeholder}
											/>
										</SelectTrigger>
										<SelectContent>
											{customTimeOptions.map((time) => (
												<SelectItem key={time} value={time}>
													{time}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full h-9" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{onboarding.buttons.loading}
							</>
						) : (
							onboarding.buttons.continue
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
