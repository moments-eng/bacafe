'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Leckerli_One } from 'next/font/google';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { useUser } from '@auth0/nextjs-auth0';
import { Sidebar } from './sidebar/sidebar';

const titleFont = Leckerli_One({
	subsets: ['latin'],
	weight: ['400'],
});

export function Header() {
	const { user } = useUser();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-md items-center justify-between">
				<div
					className={`${titleFont.className} text-xl flex items-center gap-1`}
				>
					<span>💩</span> Bapoop
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" aria-label="Toggle Menu">
							<Menu className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent
						side="right"
						className="flex w-[85vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-sm [&_*]:text-right"
					>
						<SheetTitle hidden>Bapoop</SheetTitle>
						<Sidebar user={user} />
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
