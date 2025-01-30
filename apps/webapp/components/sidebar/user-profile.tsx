import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

function generateAvatarFallback(id: string) {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${id}&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

export function UserProfile() {
  const { data: session } = useSession();
  const user = session?.user;

  const initials = (user?.name || "")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const avatar = user?.image;
  return (
    <div className="relative shrink-0">
      <div className="flex flex-col items-center gap-3 px-6 pb-8 pt-6">
        <Avatar className="h-20 w-20 rounded-full border-4 border-primary/20">
          <AvatarImage src={avatar || generateAvatarFallback(user?.id || "")} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-lg font-semibold">{user?.name}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
