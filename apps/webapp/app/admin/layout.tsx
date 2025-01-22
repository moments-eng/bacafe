import { AdminSidebar } from '@/components/admin-sidebar/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SessionProvider } from 'next-auth/react';
import './admin.css';

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<SessionProvider>
				<AdminSidebar />
				<SidebarInset>
					<div className="p-6 md:p-8 lg:p-10">{children}</div>
				</SidebarInset>
			</SessionProvider>
		</SidebarProvider>
	);
}
