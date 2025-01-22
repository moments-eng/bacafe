import { Separator } from '@/components/ui/separator';
import { bottomMenuItems, mainMenuItems } from '@/lib/constants/menu-items';
import { LogoutButton } from './logout-button';
import { Navigation } from './navigation';
import { UserProfile } from './user-profile';

export function Sidebar() {
	return (
		<div className="flex h-full flex-col">
			<UserProfile />

			<div className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
				<Navigation items={mainMenuItems} />
			</div>

			<div className="shrink-0 px-4">
				<Separator className="mb-4" />
				<div className="space-y-1">
					<Navigation items={bottomMenuItems} variant="muted" />
				</div>
				<div className="p-4">
					<LogoutButton />
				</div>
			</div>
		</div>
	);
}
