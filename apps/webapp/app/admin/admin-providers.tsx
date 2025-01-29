"use client";

import { DirectionProvider } from "@radix-ui/react-direction";

export default function AdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DirectionProvider dir="ltr">{children}</DirectionProvider>;
}
