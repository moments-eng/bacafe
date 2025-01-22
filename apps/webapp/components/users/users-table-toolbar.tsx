'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { UserTableItem } from '@/lib/types/user.types';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

interface UsersToolbarProps<TData> {
	table: Table<TData>;
}

export function UsersTableToolbar<TData>({ table }: UsersToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter users..."
					value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('email')?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<div className="flex items-center space-x-2">
				<Select
					value={table.getColumn('status')?.getFilterValue() as string}
					onValueChange={(value) =>
						table.getColumn('status')?.setFilterValue(value)
					}
				>
					<SelectTrigger className="h-8 w-[120px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="approved">Approved</SelectItem>
						<SelectItem value="disabled">Disabled</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
