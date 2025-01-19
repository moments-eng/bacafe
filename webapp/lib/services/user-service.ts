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
	async updateUser(
		email: string,
		updateData: Partial<CreateUserInput> | UpdateOperation,
	) {
		await connectDB();
		const user = await UserModel.findOneAndUpdate({ email }, updateData, {
			new: true,
		});
		return user?.toJSON() || null;
	}
}

export const userService = new UserService();
