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
import type { UserDTO } from '@/lib/dtos/user.dto';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

interface UsersToolbarProps {
	table: Table<UserDTO>;
	onApproveSelected?: () => void;
	onDisapproveSelected?: () => void;
}

export function UsersTableToolbar({
	table,
	onApproveSelected,
	onDisapproveSelected,
}: UsersToolbarProps) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const hasSelection = table.getSelectedRowModel().rows.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter users..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
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
				{hasSelection && (
					<>
						<Button
							variant="outline"
							size="sm"
							onClick={onApproveSelected}
							className="h-8"
						>
							Approve Selected
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onDisapproveSelected}
							className="h-8"
						>
							Disapprove Selected
						</Button>
					</>
				)}
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
