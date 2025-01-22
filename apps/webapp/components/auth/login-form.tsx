'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { hebrewContent } from '@/locales/he';
import FacebookLogo from '@/public/facebook-logo.svg';
import GoogleLogo from '@/public/google-logo.svg';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const { login } = hebrewContent;
	const [isLoading, setIsLoading] = useState<{
		google: boolean;
		facebook: boolean;
	}>({
		google: false,
		facebook: false,
	});

	const handleSocialLogin = async (provider: 'google' | 'facebook') => {
		try {
			setIsLoading((prev) => ({ ...prev, [provider]: true }));
			await signIn(provider, { redirectTo: '/dashboard' });
		} catch (error) {
			setIsLoading((prev) => ({ ...prev, [provider]: false }));
		}
	};

	const isAuthenticating = isLoading.google || isLoading.facebook;

	return (
		<div
			className={cn('relative w-full flex flex-col gap-8', className)}
			{...props}
		>
			{/* Decorative Elements */}
			<div className="absolute -right-20 top-20 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
			<div className="absolute -left-20 top-40 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

			{/* Main Content */}
			<div className="relative z-10 flex flex-col gap-8">
				{/* Social Buttons */}
				<div className="flex flex-col gap-3">
					<Button
						variant="outline"
						className="relative h-12 justify-center gap-2 overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10"
						onClick={() => handleSocialLogin('facebook')}
						disabled={isAuthenticating}
					>
						{isLoading.facebook ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<Image
								src={FacebookLogo}
								alt="Facebook Logo"
								width={20}
								height={20}
							/>
						)}
						<span>{login.socialLogin.facebook}</span>
					</Button>
					<Button
						variant="outline"
						className="relative h-12 justify-center gap-2 overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10"
						onClick={() => handleSocialLogin('google')}
						disabled={isAuthenticating}
					>
						{isLoading.google ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<Image
								src={GoogleLogo}
								alt="Google Logo"
								width={20}
								height={20}
							/>
						)}
						<span>{login.socialLogin.google}</span>
					</Button>
				</div>

				{/* Divider */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-muted" />
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="bg-background px-4 text-muted-foreground">
							{login.divider}
						</span>
					</div>
				</div>

				{/* Form */}
				<form className="flex flex-col gap-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">
							{login.form.email.label}
						</Label>
						<Input
							type="email"
							placeholder={login.form.email.placeholder}
							className="h-12 bg-white/5 backdrop-blur-sm"
							dir="ltr"
							disabled={isAuthenticating}
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-medium">
								{login.form.password.label}
							</Label>
							<Link
								href="/forgot-password"
								className="text-xs text-muted-foreground hover:text-primary"
							>
								{login.form.password.forgotPassword}
							</Link>
						</div>
						<Input
							type="password"
							className="h-12 bg-white/5 backdrop-blur-sm"
							dir="ltr"
							disabled={isAuthenticating}
						/>
					</div>

					<Button
						className="mt-2 h-12"
						type="submit"
						disabled={isAuthenticating}
					>
						{login.form.submit}
					</Button>
				</form>

				{/* Terms */}
				<div className="text-center text-xs text-muted-foreground">
					<span>{login.terms.prefix}</span>{' '}
					<Link href="/terms" className="hover:text-primary">
						{login.terms.termsOfService}
					</Link>{' '}
					<span>{login.terms.and}</span>{' '}
					<Link href="/privacy" className="hover:text-primary">
						{login.terms.privacyPolicy}
					</Link>
				</div>
			</div>
		</div>
	);
}
