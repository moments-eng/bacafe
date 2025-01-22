import { hebrewContent } from '@/locales/he';
import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';

const heebo = Heebo({
	subsets: ['hebrew'],
	weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
	title: hebrewContent.metadata.title,
	description: hebrewContent.metadata.description,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="he" dir="rtl">
			<body className={`${heebo.className} mobile-container`}>
				<main>{children}</main>
			</body>
		</html>
	);
}
