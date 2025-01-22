import { Button } from '@/components/ui/button';
import { hebrewContent } from '@/locales/he';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative min-h-[100dvh]">
			<div className="relative">{children}</div>
			<div>
				<Link href="/">
					<Button
						variant="ghost"
						className="gap-2 text-muted-foreground hover:text-foreground"
					>
						<span>{hebrewContent.auth.backButton}</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</Link>
			</div>
		</div>
	);
}
