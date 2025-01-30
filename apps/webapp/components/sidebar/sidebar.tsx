import { Separator } from "@/components/ui/separator";
import { bottomMenuItems, mainMenuItems } from "@/lib/constants/menu-items";
import { LogoutButton } from "./logout-button";
import { Navigation } from "./navigation";
import { UserProfile } from "./user-profile";

export function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-primary/10 via-background to-background ">
      <div className="border-b mt-12">
        <UserProfile />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <Navigation items={mainMenuItems} />
      </div>

      <div className="shrink-0 border-t">
        <div className="px-4 py-4">
          <Navigation items={bottomMenuItems} variant="muted" />
          <Separator className="my-4" />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
