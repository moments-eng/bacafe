import type { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { type User, UserModel } from '../models/user.model';
import type { Document } from 'mongoose';
import connectDB from '../db/mongoose';

interface CreateUserInput
	extends Omit<User, keyof Document | keyof TimeStamps> {}

type UpdateOperation = {
	$set?: Partial<CreateUserInput>;
	$push?: {
		articleScores?: {
			articleId: number;
			score: -1 | 1;
		};
	};
};

export class UserService {
	async createUser(userData: CreateUserInput) {
		await connectDB();
		const user = await UserModel.create(userData);
		return user.toJSON();
	}

	async getUserById(userId: string) {
		await connectDB();
		const user = await UserModel.findOne({ id: userId });
		return user?.toJSON() || null;
	}

	async updateUser(
		userId: string,
		updateData: Partial<CreateUserInput> | UpdateOperation,
	) {
		await connectDB();
		const user = await UserModel.findOneAndUpdate({ id: userId }, updateData, {
			new: true,
		});
		return user?.toJSON() || null;
	}
}

export const userService = new UserService();
