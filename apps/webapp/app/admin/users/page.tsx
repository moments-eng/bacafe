"use client";

import { columns } from "@/app/admin/users/columns";
import { UsersTableToolbar } from "@/components/admin/users/toolbar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useToast } from "@/hooks/use-toast";
import type { UserDTO } from "@/lib/dtos/user.dto";
import { QUERY_KEYS } from "@/lib/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type PaginationState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { bulkUpdateUserStatus, getUsers } from "./actions";

export default function UsersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USERS, pagination, sorting],
    queryFn: () =>
      getUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id || "createdAt",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
  });

  const { mutateAsync: bulkUpdate } = useMutation({
    mutationFn: (variables: { ids: string[]; status: boolean }) =>
      bulkUpdateUserStatus(variables.ids, variables.status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USERS],
        exact: false,
      });
      setRowSelection({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update users",
        variant: "destructive",
      });
    },
  });

  const handleBulkAction = async (action: "approve" | "disapprove") => {
    const selectedIds = Object.keys(rowSelection);
    await bulkUpdate({
      ids: selectedIds,
      status: action === "approve",
    });
    toast({
      title: "Success",
      description: `Successfully ${action}d selected users`,
    });
  };

  const table = useReactTable({
    data: data?.users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    pageCount: data?.total ? Math.ceil(data.total / pagination.pageSize) : 0,
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
          onApproveSelected={() => handleBulkAction("approve")}
          onDisapproveSelected={() => handleBulkAction("disapprove")}
        />
        <DataTable<UserDTO, unknown>
          columns={columns}
          data={data?.users || []}
          searchKey="name"
          emptyMessage="No users found"
          isLoading={isLoading}
        />
        <DataTablePagination
          table={table}
          isLoading={isLoading}
          totalItems={data?.total || 0}
        />
      </div>
    </div>
  );
}
