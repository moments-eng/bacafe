"use server";

import { auth } from "@/auth";
import { userService } from "@/lib/services/user-service";

export async function isApproved(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) {
    return false;
  }
  const user = await userService.getUser(session?.user?.email);
  return user?.approved ?? false;
}
