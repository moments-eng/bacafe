import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { type User } from 'next-auth';
import Facebook, { type FacebookProfile } from 'next-auth/providers/facebook';
import Google, { type GoogleProfile } from 'next-auth/providers/google';
import authConfig from './auth.config';
import MongoDBClient from './lib/db/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: MongoDBAdapter(MongoDBClient.getInstance()),
	session: { strategy: 'jwt' },
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
				};
			},
		}),
	],
});
