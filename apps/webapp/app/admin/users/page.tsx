'use client';

import { columns } from '@/components/admin/users/columns';
import { UsersTableToolbar } from '@/components/admin/users/toolbar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type {
	UserRole,
	UserStatus,
	UserTableItem,
	UserTier,
} from '@/lib/types/user.types';
import {
	type PaginationState,
	type SortingState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';

// This would come from your API
const mockUsers: UserTableItem[] = [
	{
		id: '1',
		email: 'john@example.com',
		name: 'John Doe',
		picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
		age: 30,
		gender: 'male',
		role: 'user' as UserRole,
		status: 'approved' as UserStatus,
		tier: 'free' as UserTier,
		isOnboardingDone: true,
		digestTime: '08:00',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
	},
	// Add more mock users...
];

export default function UsersPage() {
	const [rowSelection, setRowSelection] = useState({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [data] = useState<UserTableItem[]>(mockUsers);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		state: {
			rowSelection,
			sorting,
			pagination,
		},
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Users</h2>
					<p className="text-muted-foreground">
						Manage and monitor user accounts
					</p>
				</div>
				<Button>
					<UserPlus className="mr-2 h-4 w-4" />
					Add User
				</Button>
			</div>

			<div className="space-y-4">
				<UsersTableToolbar table={table} />
				<DataTable
					table={table}
					columns={columns}
					selectedRows={table.getFilteredSelectedRowModel().rows.length}
					totalRows={table.getFilteredRowModel().rows.length}
				/>
			</div>
		</div>
	);
}
