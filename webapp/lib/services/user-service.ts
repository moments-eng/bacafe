import type { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { type User, UserModel } from '../models/user.model';
import type { Document } from 'mongoose';
import connectDB from '../db/mongoose';

interface CreateUserInput
	extends Omit<User, keyof Document | keyof TimeStamps> {}

export class UserService {
	async createUser(userData: CreateUserInput) {
		await connectDB();
		const user = await UserModel.create(userData);
		return user.toJSON();
	}

	async getUserByAuth0Id(auth0Id: string) {
		await connectDB();
		const user = await UserModel.findOne({ auth0Id });
		return user?.toJSON() || null;
	}

	async updateUser(auth0Id: string, updateData: Partial<CreateUserInput>) {
		await connectDB();
		const user = await UserModel.findOneAndUpdate(
			{ auth0Id },
			{ $set: updateData },
			{ new: true },
		);
		return user?.toJSON() || null;
	}
}

export const userService = new UserService();
