import { auth } from "@/auth";
import { Header } from "@/components/header";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
