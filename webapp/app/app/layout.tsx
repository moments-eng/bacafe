'use client';
import { Header } from '@/components/header';
import { DirectionProvider } from '@radix-ui/react-direction';
import { SessionProvider } from 'next-auth/react';

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<DirectionProvider dir="rtl">
				<Header />
				<div className="relative flex min-h-screen flex-col">
					<main className="flex-1">{children}</main>
				</div>
			</DirectionProvider>
		</SessionProvider>
	);
}
