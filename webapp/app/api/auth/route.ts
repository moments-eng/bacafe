import { auth0 } from '@/lib/auth0';
import { userService } from '@/lib/services/user-service';
import { redirect } from 'next/navigation';

export async function GET() {
	const session = await auth0.getSession();

	if (!session?.user) {
		return redirect('/');
	}

	const existingUser = await userService.getUserByAuth0Id(session.user.sub);

	if (!existingUser) {
		await userService.createUser({
			auth0Id: session.user.sub,
			email: session.user.email || '',
			name: session.user.name || '',
			picture: session.user.picture || '',
			isOnboardingDone: false,
		});
		return redirect('/app/onboarding');
	}

	if (!existingUser.isOnboardingDone) {
		return redirect('/app/onboarding');
	}

	await auth0.updateSession({
		...session,
		user: { ...session.user, isOnboardingDone: true },
	});

	return redirect('/');
}
