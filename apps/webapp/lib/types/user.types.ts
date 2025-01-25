export type { UserDTO as UserResponse } from '@/lib/dtos/user.dto';

export enum UserStatus {
	APPROVED = 'approved',
	PENDING = 'pending',
	DISABLED = 'disabled',
}

export enum UserTier {
	FREE = 'free',
	PREMIUM = 'premium',
}

export enum UserRole {
	USER = 'user',
	ADMIN = 'admin',
}

export enum UserGender {
	MALE = 'male',
	FEMALE = 'female',
	NOT_SPECIFIED = 'notSpecified',
}
