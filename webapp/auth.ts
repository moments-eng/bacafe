import NextAuth from 'next-auth';
import client from './lib/db/db';
import { MongoDBAdapter } from '@auth/mongodb-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: MongoDBAdapter(client),
	session: { strategy: 'jwt' },
	providers: [],
});
