import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@auth0/nextjs-auth0';
import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';

export function UserNav() {
	const { user } = useUser();
	if (!user) return null;

	const initials = (user.name || '')
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase();

	return (
		<div className="p-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative flex w-full items-center justify-start gap-3 px-3 py-4 text-right"
					>
						<Avatar className="h-9 w-9 rounded-full border-2 border-primary">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="rounded-full bg-primary/10">
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-1 flex-col items-start gap-1">
							<p className="text-sm font-medium leading-none">{user.name}</p>
							<p className="text-xs text-muted-foreground">{user.email}</p>
						</div>
						<ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-[--radix-dropdown-menu-trigger-width] min-w-[240px]"
					align="end"
					sideOffset={4}
				>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col gap-2 p-2">
							<p className="text-sm font-medium leading-none">{user.name}</p>
							<p className="text-xs text-muted-foreground">{user.email}</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup className="text-right">
						<DropdownMenuItem className="flex items-center gap-2">
							<Sparkles className="h-4 w-4" />
							<span>שדרג לפרו</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup className="text-right">
						<DropdownMenuItem className="flex items-center gap-2">
							<BadgeCheck className="h-4 w-4" />
							<span>החשבון שלי</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex items-center gap-2">
							<CreditCard className="h-4 w-4" />
							<span>חיובים</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex items-center gap-2">
							<Bell className="h-4 w-4" />
							<span>התראות</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="flex items-center gap-2 text-right text-destructive">
						<LogOut className="h-4 w-4" />
						<span>התנתק</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
