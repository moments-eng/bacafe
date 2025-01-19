'use client';

import { Button } from '@/components/ui/button';
import { hebrewContent } from '@/locales/he';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function LogoutButton() {
	return (
		<Button
			variant="default"
			className="w-full gap-2"
			onClick={() => signOut({ callbackUrl: '/' })}
		>
			<LogOut className="h-4 w-4 ml-2" />
			<span className="flex-1">{hebrewContent.navigation.menu.logout}</span>
		</Button>
	);
}
