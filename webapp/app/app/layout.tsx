'use client';
import { Header } from '@/components/header';
import { DirectionProvider } from '@radix-ui/react-direction';

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DirectionProvider dir="rtl">
			<Header />
			<div className="relative flex min-h-screen flex-col">
				<main className="flex-1">{children}</main>
			</div>
		</DirectionProvider>
	);
}
