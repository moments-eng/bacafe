"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DirectionProvider } from "@radix-ui/react-direction";

export default function AdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DirectionProvider dir="ltr">
      <SidebarProvider>{children}</SidebarProvider>
    </DirectionProvider>
  );
}
