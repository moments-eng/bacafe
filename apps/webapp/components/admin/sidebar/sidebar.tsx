'use client';

import { Coffee, Database, Users } from 'lucide-react';

import { NavMain } from '@/components/admin/sidebar/nav-main';
import { NavUser } from '@/components/admin/sidebar/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';

// Sample data - replace with real data later
const data = {
	user: {
		name: 'Admin User',
		email: 'admin@bacafe.com',
		avatar: '/avatars/admin.jpg',
	},
	navMain: [
		{
			title: 'Users',
			url: '/admin/users',
			icon: Users,
			isActive: true,
		},
		{
			title: 'Feeds',
			url: '/admin/feeds',
			icon: Database,
		},
	],
};

export function AdminSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-2">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<Coffee className="size-5" />
					</div>
					<span className="text-lg font-semibold">Bacafe</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
