import type { UserRole } from "@/lib/types/user.types";
import NextAuth, { Session } from "next-auth";

export interface InternalUser {
  isOnboardingDone?: boolean;
  role?: UserRole;
  approved?: boolean;
  id: string;
}

declare module "next-auth" {
  interface User extends InternalUser {}

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: import("next-auth").User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: UserRole;
    isOnboardingDone: boolean;
    approved: boolean;
  }
}
