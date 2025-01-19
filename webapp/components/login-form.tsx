'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { hebrewContent } from '@/locales/he';
import FacebookLogo from '@/public/facebook-logo.svg';
import GoogleLogo from '@/public/google-logo.svg';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const { login } = hebrewContent;

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
						onClick={() => signIn('facebook', { redirectTo: '/app' })}
					>
						<Image
							src={FacebookLogo}
							alt="Facebook Logo"
							width={20}
							height={20}
						/>
						<span>{login.socialLogin.facebook}</span>
					</Button>
					<Button
						variant="outline"
						className="relative h-12 justify-center gap-2 overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10"
						onClick={() => signIn('google', { redirectTo: '/app' })}
					>
						<Image src={GoogleLogo} alt="Google Logo" width={20} height={20} />
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
						/>
					</div>

					<Button className="mt-2 h-12" type="submit">
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
