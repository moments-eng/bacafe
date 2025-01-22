'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type {
	UserRole,
	UserStatus,
	UserTableItem,
	UserTier,
} from '@/lib/types/user.types';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, UserCheck, UserX } from 'lucide-react';

export const columns: ColumnDef<UserTableItem>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'picture',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="User" />
		),
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-4">
					<Avatar>
						<AvatarImage src={user.picture} alt={user.name} />
						<AvatarFallback>
							{user.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">{user.name}</span>
						<span className="text-sm text-muted-foreground">{user.email}</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const status: UserStatus = row.getValue('status');
			return (
				<Badge
					variant={
						status === 'approved'
							? 'default'
							: status === 'pending'
								? 'secondary'
								: 'destructive'
					}
				>
					{status}
				</Badge>
			);
		},
		filterFn: (row, id, value) => {
			return value === 'all' ? true : row.getValue(id) === value;
		},
	},
	{
		accessorKey: 'role',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const role: UserRole = row.getValue('role');
			return <Badge variant="outline">{role}</Badge>;
		},
	},
	{
		accessorKey: 'tier',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Tier" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			const tier = row.getValue<UserTier>('tier');
			return (
				<Badge variant={tier === 'premium' ? 'default' : 'secondary'}>
					{tier}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Joined" />
		),
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<span className="text-muted-foreground">
					{new Date(row.getValue('createdAt')).toLocaleDateString()}
				</span>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(user.id)}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuItem>View user details</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<UserCheck className="mr-2 h-4 w-4" /> Approve user
						</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive">
							<UserX className="mr-2 h-4 w-4" /> Disable user
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
