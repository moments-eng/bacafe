import { LoginForm } from '@/components/login-form';
import { hebrewContent } from '@/locales/he';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'התחברות | Bacafe',
	description: 'התחבר לחשבון Bacafe שלך',
};

export default function LoginPage() {
	const { auth } = hebrewContent;

	return (
		<div className="flex min-h-[100dvh] flex-col items-center">
			<div className="w-full max-w-[400px] px-4">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold">{auth.pages.login.title}</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{auth.pages.login.description}
					</p>
				</div>

				<LoginForm />
			</div>
		</div>
	);
}
