import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { hebrewContent } from '@/locales/he';
import { Bona_Nova_SC } from 'next/font/google';
import Link from 'next/link';
import './home.css';

const titleFont = Bona_Nova_SC({
	subsets: ['hebrew'],
	weight: ['400'],
});

async function getStartHereUrl() {
	const session = await auth();
	return session?.user ? '/dashboard' : '/login';
}

export async function Home() {
	const startHereUrl = await getStartHereUrl();
	return (
		<div>
			<h1 className={`${titleFont.className} brand-title`}>
				{hebrewContent.companyName} <span>☕</span>
			</h1>

			<p className="text-center text-muted-foreground mt-2 font-medium font-heebo">
				{hebrewContent.tagline}
			</p>

			<div className="mt-12 space-y-6 text-center">
				<h2 className="text-4xl font-bold tracking-tight text-foreground font-heebo">
					{hebrewContent.mainTitle}
					<span className="text-primary block mt-1">
						{hebrewContent.mainTitleHighlight}
					</span>
				</h2>

				<p className="text-muted-foreground max-w-[42rem] mx-auto leading-relaxed text-lg font-heebo">
					{hebrewContent.description}
				</p>

				<div className="flex flex-col gap-4 px-4">
					<Link href={startHereUrl}>
						<Button size="lg" className="w-full font-medium font-heebo">
							{hebrewContent.startButton}
						</Button>
					</Link>

					<Button
						size="lg"
						variant="outline"
						className="w-full font-medium font-heebo"
					>
						{hebrewContent.learnMore}
					</Button>
				</div>
			</div>
		</div>
	);
}
