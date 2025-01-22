'use client';

import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { type Table as TableType, flexRender } from '@tanstack/react-table';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData> {
	table: TableType<TData>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	columns: any[];
	selectedRows: number;
	totalRows: number;
}

export function DataTable<TData>({
	table,
	columns,
	selectedRows,
	totalRows,
}: DataTableProps<TData>) {
	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{selectedRows > 0 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						{selectedRows} of {totalRows} row(s) selected.
					</p>
					<div className="flex items-center space-x-2">
						<Button variant="outline" size="sm">
							Approve Selected
						</Button>
						<Button variant="outline" size="sm" className="text-destructive">
							Disable Selected
						</Button>
					</div>
				</div>
			)}

			<DataTablePagination table={table} />
		</div>
	);
}
