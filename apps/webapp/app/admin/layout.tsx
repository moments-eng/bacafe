import { auth } from '@/auth';
import { AdminSidebar } from '@/components/admin/sidebar/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import './admin-globals.css';
import './admin.css';

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (session?.user.role && session.user.role !== 'admin') {
		redirect('/');
	}

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
