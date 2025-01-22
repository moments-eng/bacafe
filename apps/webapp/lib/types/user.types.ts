import type { Gender } from '@/lib/models/user.model';

export type UserRole = 'user' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'disabled';
export type UserTier = 'free' | 'premium';

export interface UserTableItem {
	id: string;
	email: string;
	name: string;
	picture?: string;
	age?: number;
	gender?: Gender;
	role: UserRole;
	status: UserStatus;
	tier: UserTier;
	isOnboardingDone: boolean;
	digestTime: string;
	createdAt: Date;
	updatedAt: Date;
}
