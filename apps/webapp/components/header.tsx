"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { hebrewContent } from "@/locales/he";
import { Menu } from "lucide-react";
import { Bona_Nova_SC } from "next/font/google";
import { Sidebar } from "./sidebar/sidebar";
import Image from "next/image";

const titleFont = Bona_Nova_SC({
  subsets: ["hebrew"],
  weight: ["400"],
});

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur px-4">
      <div className="container flex h-14 max-w-screen-md items-center justify-between">
        <div
          className={`${titleFont.className} text-xl flex items-center gap-2`}
        >
          {hebrewContent.companyName}
          <Image
            src="/logo.png"
            alt="Friendly Mascot"
            width={36}
            height={36}
            priority
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Toggle Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-[85vw] flex-col p-0 sm:max-w-sm [&_*]:text-right"
          >
            <SheetTitle hidden>Menu</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
