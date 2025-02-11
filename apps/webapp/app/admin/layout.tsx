import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/sidebar/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { userService } from "@/lib/services/user-service";
import { redirect } from "next/navigation";
import "./admin-globals.css";
import AdminProviders from "./admin-providers";
import "./admin.css";

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
    console.log("redirecting...");
    redirect("/");
  }

  return (
    <AdminProviders>
      <AdminSidebar />
      <SidebarInset>
        <div className="p-6 md:p-8 lg:p-10">{children}</div>
      </SidebarInset>
    </AdminProviders>
  );
}
