'use server';

import { auth } from '@/auth';
import { UserGender } from '@/lib/models/user.model';
import { userService } from '@/lib/services/user-service';
import { unauthorized } from 'next/navigation';
import { z } from 'zod';

const userUpdateSchema = z.object({
	name: z.string().min(2).max(50).optional(),
	age: z.number().min(13).max(120).optional(),
	gender: z
		.enum([UserGender.FEMALE, UserGender.MALE, UserGender.NOT_SPECIFIED])
		.optional(),
	isOnboardingDone: z.boolean().optional(),
	digestTime: z.string().optional(),
	articleScores: z
		.array(
			z.object({
				articleId: z.number(),
				score: z.union([z.literal(-1), z.literal(1)]),
			}),
		)
		.optional(),
});

type UserUpdateData = z.infer<typeof userUpdateSchema>;

interface UpdateUserResponse {
	success: boolean;
	error?: string;
}

export async function updateUser(
	data: UserUpdateData,
): Promise<UpdateUserResponse> {
	const session = await auth();
	if (!session?.user?.email) {
		return unauthorized();
	}

	console.log('Starting updateUser with data:', data);

	const userEmail = session.user.email;

	console.log('Processing update for userId:', userEmail);

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

		await userService.updateUser(userEmail, { $set: validatedFields.data });
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

export async function updateArticleScore(
	articleId: number,
	score: -1 | 1,
): Promise<UpdateUserResponse> {
	const session = await auth();
	if (!session?.user?.email) {
		return unauthorized();
	}
	const userEmail = session.user.email;

	try {
		await userService.updateUser(userEmail, {
			$push: { articleScores: { articleId, score } },
		});

		return {
			success: true,
		};
	} catch (error) {
		console.error('Error updating article score:', error);
		return {
			success: false,
			error: 'Failed to update article score',
		};
	}
}
