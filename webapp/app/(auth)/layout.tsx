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
			{/* Back Button */}
			<div className="absolute right-4 top-4 z-50">
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

			{/* Main Content */}
			<div className="relative">{children}</div>
		</div>
	);
}
