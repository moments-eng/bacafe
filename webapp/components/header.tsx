'use client';

import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Sidebar } from './sidebar/sidebar';
import { hebrewContent } from '@/locales/he';
import { Bona_Nova_SC } from 'next/font/google';

const titleFont = Bona_Nova_SC({
	subsets: ['hebrew'],
	weight: ['400'],
});

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b backdrop-blur ">
			<div className="container flex h-14 max-w-screen-md items-center justify-between">
				<div
					className={`${titleFont.className} text-xl flex items-center gap-1`}
				>
					{hebrewContent.companyName} <span>☕</span>
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
						<Sidebar />
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
