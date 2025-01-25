'use server';

import { auth } from '@/auth';
import { type UserDTO, UserTransformer } from '@/lib/dtos/user.dto';
import { type User, UserModel } from '@/lib/models/user.model';
import type { UserRole } from '@/lib/types/user.types';
import type { FilterQuery } from 'mongoose';
import { revalidatePath } from 'next/cache';

interface GetUsersOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	search?: string;
	status?: string;
	role?: string;
}

interface UserFilters extends FilterQuery<User> {
	approved?: boolean;
	role?: string;
	$or?: Partial<{
		name: { $regex: string; $options: string };
		email: { $regex: string; $options: string };
	}>[];
}

interface GetUsersResponse {
	users: UserDTO[];
	total: number;
	pageCount: number;
}

async function checkAdminAccess() {
	const session = await auth();
	if (!session?.user?.email) {
		throw new Error('Unauthorized - Not logged in');
	}

	const user = await UserModel.findOne({ email: session.user.email });
	if (!user || user.role !== 'admin') {
		throw new Error('Unauthorized - Admin access required');
	}
}

export async function getUsers({
	page = 1,
	limit = 10,
	sortBy = 'createdAt',
	sortOrder = 'desc',
	search = '',
	status,
	role,
}: GetUsersOptions = {}): Promise<GetUsersResponse> {
	try {
		await checkAdminAccess();

		const skip = (page - 1) * limit;

		const filters: UserFilters = {};
		if (status && status !== 'all') filters.approved = status === 'approved';
		if (role) filters.role = role;
		if (search) {
			filters.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
			];
		}

		const [users, total] = await Promise.all([
			UserModel.find(filters)
				.sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			UserModel.countDocuments(filters),
		]);

		return {
			users: users.map(UserTransformer.toDTO),
			total,
			pageCount: Math.ceil(total / limit),
		};
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
}

export async function updateUserStatus(userId: string, approved: boolean) {
	try {
		await checkAdminAccess();

		await UserModel.findByIdAndUpdate(userId, { approved });
		revalidatePath('/admin/users');

		return { success: true };
	} catch (error) {
		console.error('Error updating user status:', error);
		throw error;
	}
}

export async function bulkUpdateUserStatus(
	userIds: string[],
	approved: boolean,
) {
	try {
		await checkAdminAccess();

		await UserModel.updateMany(
			{ _id: { $in: userIds } },
			{ $set: { approved } },
		);
		revalidatePath('/admin/users');

		return { success: true };
	} catch (error) {
		console.error('Error bulk updating users:', error);
		throw error;
	}
}

export async function updateUserRole(userId: string, role: UserRole) {
	try {
		await checkAdminAccess();

		await UserModel.findByIdAndUpdate(userId, { role });
		revalidatePath('/admin/users');

		return { success: true };
	} catch (error) {
		console.error('Error updating user role:', error);
		throw error;
	}
}
