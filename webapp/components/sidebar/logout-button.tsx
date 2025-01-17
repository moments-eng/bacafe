import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { hebrewContent } from '@/locales/he';

export function LogoutButton() {
	return (
		<Link href="/auth/logout">
			<Button variant="default" className="w-full gap-2">
				<LogOut className="h-4 w-4 ml-2" />
				<span className="flex-1">{hebrewContent.navigation.menu.logout}</span>
			</Button>
		</Link>
	);
}
