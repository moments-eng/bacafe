import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { type User } from "next-auth";
import Facebook, { type FacebookProfile } from "next-auth/providers/facebook";
import Google, { type GoogleProfile } from "next-auth/providers/google";
import authConfig from "./auth.config";
import MongoDBClient from "./lib/db/db";
import { userService } from "./lib/services/user-service";
import { UserRole } from "./lib/types/user.types";

const jwtTrigger = ["signUp", "signIn", "update"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(MongoDBClient.getInstance()),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile: GoogleProfile): User {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: UserRole.USER,
          approved: false,
        };
      },
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile: FacebookProfile): User {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
          role: UserRole.USER,
          approved: false,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, trigger, session }) => {
      if (jwtTrigger.includes(trigger || "") && token.email) {
        const user = await userService.getUser(token.email);
        if (!user) return null;
        token.role = user.role;
        token.approved = user.approved;
        token.id = user._id.toString();
        token.isOnboardingDone = user.isOnboardingDone;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.role = token.role;
      session.user.approved = token.approved;
      session.user.id = token.id;
      session.user.isOnboardingDone = token.isOnboardingDone;
      return session;
    },
  },
});
