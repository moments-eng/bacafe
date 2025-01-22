import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface LegalLayoutProps {
	children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
	return (
		<div className="container px-4 py-6 min-h-screen">
			<ScrollArea className="h-[calc(100vh-200px)]">{children}</ScrollArea>
		</div>
	);
}
