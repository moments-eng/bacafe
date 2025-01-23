import { getUser } from '@/actions/user';
import { auth } from '@/auth';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { hebrewContent } from '@/locales/he';
import { redirect } from 'next/navigation';
import { ApprovalPending } from './components/approval-pending';

export default async function Page() {
	const session = await auth();

	if (!session?.user?.email) {
		redirect('/login');
	}

	const user = await getUser();

	if (!user?.isOnboardingDone) {
		redirect('/dashboard/onboarding');
	}

	if (!user.approved) {
		return <ApprovalPending />;
	}

	const { welcome } = hebrewContent.app;

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div className="space-y-2">
				<h1 className="text-2xl font-bold">
					{welcome.greeting.replace('{name}', user.name || '')}
				</h1>
				<p className="text-muted-foreground">{welcome.subtitle}</p>
			</div>

			<Card className="p-6 space-y-4">
				<div className="flex items-center gap-2">
					<h2 className="text-xl font-semibold">{welcome.title}</h2>
					<Badge variant="secondary" className="text-xs">
						{welcome.beta.label}
					</Badge>
				</div>

				<p className="text-sm text-muted-foreground">{welcome.description}</p>

				<ul className="space-y-3">
					{welcome.features.map((feature) => (
						<li key={feature} className="flex items-center gap-2">
							<span className="text-primary">•</span>
							<span className="text-sm">{feature}</span>
						</li>
					))}
				</ul>

				<div className="mt-6 bg-secondary/50 p-4 rounded-lg">
					<p className="text-sm text-secondary-foreground">
						{welcome.beta.text}
					</p>
				</div>
			</Card>
		</div>
	);
}
