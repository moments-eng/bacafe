'use server';

import { auth0 } from '@/lib/auth0';
import { userService } from '@/lib/services/user-service';
import { unauthorized } from 'next/navigation';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const userUpdateSchema = z.object({
	name: z.string().min(2).max(50).optional(),
	age: z.number().min(13).max(120).optional(),
	gender: z.enum(['male', 'female', 'notSpecified']).optional(),
	interests: z.array(z.string()).min(3).optional(),
	isOnboardingDone: z.boolean().optional(),
	digestTime: z.string().optional(),
});

type UserUpdateData = z.infer<typeof userUpdateSchema>;

interface UpdateUserResponse {
	success: boolean;
	error?: string;
}

export async function updateUser(
	data: UserUpdateData,
): Promise<UpdateUserResponse> {
	console.log('Starting updateUser with data:', data);

	const user = await auth0.getSession();

	if (!user?.user.sub) {
		console.log('No user sub found, returning unauthorized');
		return unauthorized();
	}

	const userId = user.user.sub;
	console.log('Processing update for userId:', userId);

	try {
		const validatedFields = userUpdateSchema.safeParse(data);
		console.log('Validation result:', validatedFields);

		if (!validatedFields.success) {
			console.log('Validation failed:', validatedFields.error);
			return {
				success: false,
				error: 'Invalid data provided',
			};
		}

		await userService.updateUser(userId, validatedFields.data);
		console.log('User updated successfully');

		return {
			success: true,
		};
	} catch (error) {
		console.error('Error updating user:', error);
		return {
			success: false,
			error: 'Failed to update user',
		};
	}
}

export async function markOnboardingDone() {
	const session = await auth0.getSession();

	if (!session?.user?.sub) {
		return unauthorized();
	}

	await auth0.updateSession({
		...session,
		user: { ...session.user, isOnboardingDone: true },
	});
}
