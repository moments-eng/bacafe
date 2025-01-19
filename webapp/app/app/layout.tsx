'use client';
import { Header } from '@/components/header';
import { DirectionProvider } from '@radix-ui/react-direction';
import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import Loading from './loading';

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
					<main className="flex-1">
						<Suspense fallback={<Loading />}>{children}</Suspense>
					</main>
				</div>
			</DirectionProvider>
		</SessionProvider>
	);
}
