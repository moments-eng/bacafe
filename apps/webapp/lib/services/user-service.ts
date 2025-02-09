import type { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import type { Document } from "mongoose";
import connectDB from "../db/mongoose";
import { PreferredArticle, type User, UserModel } from "../models/user.model";

interface CreateUserInput
  extends Omit<User, keyof Document | keyof TimeStamps> {}

type UpdateOperation = {
  $set?: Partial<CreateUserInput>;
  $push?: {
    preferences?: PreferredArticle;
  };
};

export class UserService {
  async updateUser(
    email: string,
    updateData: Partial<CreateUserInput> | UpdateOperation
  ) {
    await connectDB();
    const user = await UserModel.findOneAndUpdate({ email }, updateData, {
      new: true,
    });
    return user?.toJSON() || null;
  }

  async getUser(email: string): Promise<User | null> {
    await connectDB();
    return UserModel.findOne({ email }, { embeddings: false }).lean();
  }
}

export const userService = new UserService();
