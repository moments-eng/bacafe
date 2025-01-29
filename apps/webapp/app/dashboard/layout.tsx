import { Header } from "@/components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
