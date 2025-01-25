'use client';

import { updateUserRole, updateUserStatus } from '@/app/admin/users/actions';
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
import { useToast } from '@/hooks/use-toast';
import { QUERY_KEYS } from '@/lib/queries';
import {
	type UserResponse,
	UserRole,
	type UserStatus,
	type UserTier,
} from '@/lib/types/user.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, UserCheck, UserX } from 'lucide-react';

export const columns: ColumnDef<UserResponse>[] = [
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
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="User" />
		),
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-4">
					<Avatar>
						<AvatarImage src={user.image} alt={user.name} />
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
		filterFn: (row, id, value) => {
			return row
				.getValue<string>(id)
				.toLowerCase()
				.includes(value.toLowerCase());
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
			const { toast } = useToast();
			const queryClient = useQueryClient();

			const { mutate: updateStatus } = useMutation({
				mutationFn: (approved: boolean) => updateUserStatus(user.id, approved),
				onSuccess: (data) => {
					queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
					toast({
						title: 'Success',
						description: `User ${data.success ? 'approved' : 'disapproved'} successfully`,
					});
				},
				onError: (error) => {
					toast({
						title: 'Error',
						description:
							error instanceof Error
								? error.message
								: 'Failed to update status',
						variant: 'destructive',
					});
				},
			});

			const { mutate: updateRole } = useMutation({
				mutationFn: (role: UserRole) => updateUserRole(user.id, role),
				onSuccess: (_, variable) => {
					queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
					toast({
						title: 'Success',
						description: `User role updated to ${variable}`,
					});
				},
				onError: (error) => {
					toast({
						title: 'Error',
						description:
							error instanceof Error ? error.message : 'Failed to update role',
						variant: 'destructive',
					});
				},
			});

			const handleStatusUpdate = (approved: boolean) => updateStatus(approved);
			const handleRoleUpdate = (role: UserRole) => updateRole(role);

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
						<DropdownMenuItem onClick={() => handleStatusUpdate(true)}>
							<UserCheck className="mr-2 h-4 w-4" /> Approve user
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleStatusUpdate(false)}
							className="text-destructive"
						>
							<UserX className="mr-2 h-4 w-4" /> Disapprove user
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => handleRoleUpdate(UserRole.ADMIN)}>
							Make admin
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleRoleUpdate(UserRole.USER)}>
							Make user
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
