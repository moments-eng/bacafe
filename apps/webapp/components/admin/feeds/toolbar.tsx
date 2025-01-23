'use client';

import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Cross2Icon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { RefreshCw } from 'lucide-react';

interface FeedsTableToolbarProps<TData> {
	table: Table<TData>;
}

export function FeedsTableToolbar<TData>({
	table,
}: FeedsTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter providers..."
					value={
						(table.getColumn('provider')?.getFilterValue() as string) ?? ''
					}
					onChange={(event) =>
						table.getColumn('provider')?.setFilterValue(event.target.value)
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
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					className="ml-auto h-8"
					onClick={() => table.toggleAllRowsExpanded()}
				>
					<MixerHorizontalIcon className="mr-2 h-4 w-4" />
					Toggle Groups
				</Button>
				<DataTableViewOptions table={table} />
				<Button
					variant="outline"
					size="sm"
					className="h-8"
					onClick={() => table.reset()}
				>
					<RefreshCw className="mr-2 h-4 w-4" />
					Refresh
				</Button>
			</div>
		</div>
	);
}
