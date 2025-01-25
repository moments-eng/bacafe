'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserGender } from '@/lib/types/user.types';
import { hebrewContent } from '@/locales/he';
import { useOnboardingStore } from '@/stores/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updateUser } from '../actions';

const { onboarding } = hebrewContent;

const formSchema = z.object({
	name: z.string().min(2, {
		message: onboarding.steps.personalDetails.name.error,
	}),
	age: z.union([
		z.string().refine((val) => val === '', {
			message: onboarding.steps.personalDetails.age.error,
		}),
		z.number().min(13).max(120, {
			message: onboarding.steps.personalDetails.age.error,
		}),
	]),
	gender: z.enum([
		UserGender.FEMALE,
		UserGender.MALE,
		UserGender.NOT_SPECIFIED,
	]),
});

type FormValues = z.infer<typeof formSchema>;

export function PersonalDetailsStep() {
	const { name, age, gender, setName, setAge, setGender, nextStep } =
		useOnboardingStore();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: name,
			age: age && age > 0 ? age : '',
			gender: gender,
		},
	});

	const onSubmit = async (values: FormValues) => {
		setIsLoading(true);
		try {
			const result = await updateUser({
				name: values.name,
				age: typeof values.age === 'string' ? undefined : values.age,
				gender: values.gender,
			});

			if (result.success) {
				setName(values.name);
				setAge(typeof values.age === 'string' ? 0 : values.age);
				setGender(values.gender);
				nextStep();
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold">{onboarding.steps[1].header}</h2>
				<p className="text-sm text-muted-foreground">
					{onboarding.steps[1].subheader}
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="space-y-1">
								<FormLabel className="text-sm">
									{onboarding.steps.personalDetails.name.label}
								</FormLabel>
								<FormControl>
									<Input
										placeholder={
											onboarding.steps.personalDetails.name.placeholder
										}
										className="h-9"
										{...field}
									/>
								</FormControl>
								<FormDescription className="text-xs">
									{onboarding.steps.personalDetails.name.description}
								</FormDescription>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="age"
						render={({ field }) => (
							<FormItem className="space-y-1">
								<FormLabel className="text-sm">
									{onboarding.steps.personalDetails.age.label}
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										inputMode="numeric"
										pattern="[0-9]*"
										placeholder={
											onboarding.steps.personalDetails.age.placeholder
										}
										className="h-9"
										{...field}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value === '' ? '' : Number(value));
										}}
										value={field.value}
										min={13}
										max={120}
									/>
								</FormControl>
								<FormDescription className="text-xs">
									{onboarding.steps.personalDetails.age.description}
								</FormDescription>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<FormLabel className="text-sm">
									{onboarding.steps.personalDetails.gender.label}
								</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col gap-1"
									>
										{Object.entries(
											onboarding.steps.personalDetails.gender.options,
										).map(([value, label]) => (
											<FormItem
												key={value}
												className="flex items-center space-x-3 space-x-reverse"
											>
												<FormControl>
													<RadioGroupItem value={value} className="h-4 w-4" />
												</FormControl>
												<FormLabel className="text-sm font-normal">
													{label}
												</FormLabel>
											</FormItem>
										))}
									</RadioGroup>
								</FormControl>
								<FormDescription className="text-xs">
									{onboarding.steps.personalDetails.gender.description}
								</FormDescription>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full h-9 mt-2"
						disabled={isLoading}
					>
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
