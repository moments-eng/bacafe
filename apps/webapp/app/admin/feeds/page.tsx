"use client";

import { FeedsTableToolbar } from "@/components/admin/feeds/toolbar";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FeedDto,
  PaginatedFeedsDto,
} from "@/generated/http-clients/backend/api";
import { useToast } from "@/hooks/use-toast";
import { QUERY_KEYS } from "@/lib/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { getFeeds } from "./client-actions";
import { columns } from "./columns";
import { CreateFeedDialog } from "./create-dialog";
import { BulkFeedsDialog } from "./bulk-dialog";

export default function FeedsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching } = useQuery<PaginatedFeedsDto>({
    queryKey: [QUERY_KEYS.FEEDS, pageIndex, pageSize, sorting, columnFilters],
    queryFn: () =>
      getFeeds({
        page: pageIndex + 1,
        limit: pageSize,
        filter: {
          provider: columnFilters.find((f) => f.id === "provider")
            ?.value as string,
        },
        sort: sorting.reduce(
          (acc, sort) => {
            acc[sort.id] = sort.desc ? "desc" : "asc";
            return acc;
          },
          {} as Record<string, "asc" | "desc">
        ),
      }),
  });

  const handleCreateSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
  }, [queryClient]);

  const table = useReactTable<FeedDto>({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    pageCount: data ? Math.ceil(data.total / pageSize) : -1,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            RSS Feeds Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all RSS feed sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BulkFeedsDialog onSuccess={handleCreateSuccess} />
          <CreateFeedDialog onSuccess={handleCreateSuccess} />
        </div>
      </div>

      <div className="space-y-4">
        <FeedsTableToolbar table={table} />
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            <DataTable<FeedDto, unknown>
              columns={columns}
              data={data?.items || []}
              isLoading={isFetching}
              searchKey="provider"
              emptyMessage="No feeds found"
            />
            <DataTablePagination
              table={table}
              isLoading={isFetching}
              totalItems={data?.total || 0}
            />
          </>
        )}
      </div>
    </div>
  );
}
