import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import "./admin-globals.css";
import "./admin.css";
import { ToastProvider } from "@/components/ui/toast";
import { userService } from "@/lib/services/user-service";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await userService.getUser(session.user.email);
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <SessionProvider>
        <ToastProvider>
          <AdminSidebar />
          <SidebarInset>
            <div className="p-6 md:p-8 lg:p-10">{children}</div>
          </SidebarInset>
        </ToastProvider>
      </SessionProvider>
    </SidebarProvider>
  );
}
