import { auth } from '@/auth';
import type { User } from '@/lib/models/user.model';
import { userService } from '@/lib/services/user-service';

export async function getUser(): Promise<User | null> {
	const session = await auth();
	if (!session?.user?.email) return null;

	const user = await userService.getUser(session.user.email);
	return user;
}
