import NextAuth, { Session } from 'next-auth';

export interface InternalUser {
	isOnboardingDone?: boolean;
}

declare module 'next-auth' {
	interface User extends InternalUser {}

	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: import('next-auth').User;
	}
}
