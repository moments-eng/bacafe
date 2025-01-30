"use server";

import connectDB from "@/lib/db/mongoose";
import { type UserDTO, UserTransformer } from "@/lib/dtos/user.dto";
import { type User, UserModel } from "@/lib/models/user.model";
import type { UserRole } from "@/lib/types/user.types";
import type { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { withAdminAccess } from "../utils/auth";
import { dailyDigestApi } from "@/lib/http-clients/backend/client";

interface GetUsersOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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

async function getUsersAction({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  search = "",
  status,
  role,
}: GetUsersOptions = {}): Promise<GetUsersResponse> {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    const filters: UserFilters = {};
    if (status && status !== "all") filters.approved = status === "approved";
    if (role) filters.role = role;
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filters)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
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
    console.error("Error fetching users:", error);
    throw error;
  }
}

async function updateUserStatusAction(userId: string, approved: boolean) {
  try {
    await UserModel.findByIdAndUpdate(userId, { approved });
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}

async function bulkUpdateUserStatusAction(
  userIds: string[],
  approved: boolean
) {
  try {
    await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { approved } }
    );
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error bulk updating users:", error);
    throw error;
  }
}

async function updateUserRoleAction(userId: string, role: UserRole) {
  try {
    await UserModel.findByIdAndUpdate(userId, { role });
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

async function generateUserDailyDigestAction(userId: string) {
  try {
    await dailyDigestApi.triggerDailyDigest(userId);
    return { success: true };
  } catch (error) {
    console.error("Error generating daily digest:", error);
    throw error;
  }
}

async function deliverUserDailyDigestAction(userId: string) {
  try {
    await dailyDigestApi.deliverDailyDigest(userId);
    return { success: true };
  } catch (error) {
    console.error("Error delivering daily digest:", error);
    throw error;
  }
}

export const getUsers = withAdminAccess(getUsersAction);
export const updateUserStatus = withAdminAccess(updateUserStatusAction);
export const bulkUpdateUserStatus = withAdminAccess(bulkUpdateUserStatusAction);
export const updateUserRole = withAdminAccess(updateUserRoleAction);
export const generateUserDailyDigest = withAdminAccess(
  generateUserDailyDigestAction
);
export const deliverUserDailyDigest = withAdminAccess(
  deliverUserDailyDigestAction
);
