import { auth } from "@/auth";
import { userService } from "@/lib/services/user-service";

export async function checkAdminAccess() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized - Not logged in");
  }

  const user = await userService.getUser(session.user.email);
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized - Admin access required");
  }
}

export function withAdminAccess<T extends (...args: any[]) => Promise<any>>(
  action: T
): T {
  return (async (...args: Parameters<T>) => {
    await checkAdminAccess();
    return action(...args);
  }) as T;
}
