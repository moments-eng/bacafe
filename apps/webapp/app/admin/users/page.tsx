'use client';

import { columns } from '@/components/admin/users/columns';
import { UsersTableToolbar } from '@/components/admin/users/toolbar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';
import type { UserResponse } from '@/lib/types/user.types';
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
import { useEffect, useState } from 'react';
import { bulkUpdateUserStatus, getUsers } from './actions';

export default function UsersPage() {
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);
	const [rowSelection, setRowSelection] = useState({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [data, setData] = useState<UserResponse[]>([]);
	const [totalRows, setTotalRows] = useState(0);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const result = await getUsers({
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize,
				sortBy: sorting[0]?.id || 'createdAt',
				sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
			});
			setData(result.users);
			setTotalRows(result.total);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to fetch users',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchUsers();
	}, [pagination.pageIndex, pagination.pageSize, sorting]);

	const handleBulkAction = async (action: 'approve' | 'disapprove') => {
		try {
			const selectedIds = Object.keys(rowSelection);
			await bulkUpdateUserStatus(selectedIds, action === 'approve');
			await fetchUsers();
			setRowSelection({});
			toast({
				title: 'Success',
				description: `Successfully ${action}d selected users`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: `Failed to ${action} users`,
				variant: 'destructive',
			});
		}
	};

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
		pageCount: Math.ceil(totalRows / pagination.pageSize),
		state: {
			rowSelection,
			sorting,
			pagination,
		},
		manualPagination: true,
		manualSorting: true,
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
				<UsersTableToolbar
					table={table}
					onApproveSelected={() => handleBulkAction('approve')}
					onDisapproveSelected={() => handleBulkAction('disapprove')}
				/>
				<DataTable
					table={table}
					columns={columns}
					selectedRows={table.getFilteredSelectedRowModel().rows.length}
					totalRows={totalRows}
				/>
			</div>
		</div>
	);
}
