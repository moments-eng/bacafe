import { z } from 'zod';

export const UserSchema = z.object({
	_id: z.string().optional(),
	auth0Id: z.string(),
	email: z.string().email(),
	name: z.string(),
	isOnboardingDone: z.boolean().default(false),
	age: z.number().min(13).max(120).optional(),
	picture: z.string().url().optional(),
	lastLogin: z.date().optional(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof UserSchema>;
