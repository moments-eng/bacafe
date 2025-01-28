import type { User } from '@/lib/models/user.model';
import {
	type UserGender,
	type UserRole,
	UserStatus,
	UserTier,
} from '@/lib/types/user.types';
import type { Types } from 'mongoose';

export interface UserDTO {
	id: string;
	email: string;
	name: string;
	image?: string;
	age?: number;
	gender?: UserGender;
	isOnboardingDone: boolean;
	digestTime: string | null;
	role: UserRole;
	status: UserStatus;
	tier: UserTier;
	createdAt: Date;
	updatedAt: Date;
}

export const UserTransformer = {
	toDTO(user: User): UserDTO {
		return {
			id: user._id.toString(),
			email: user.email,
			name: user.name,
			image: user.image,
			age: user.age,
			gender: user.gender,
			isOnboardingDone: user.isOnboardingDone,
			digestTime: user.digestTime || null,
			role: user.role,
			status: user.approved ? UserStatus.APPROVED : UserStatus.PENDING,
			tier: UserTier.FREE,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	},
};
