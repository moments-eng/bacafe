"use client";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { QUERY_KEYS } from "@/lib/queries";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface FeedsTableToolbarProps<TData> {
  table: Table<TData>;
}

export function FeedsTableToolbar<TData>({
  table,
}: FeedsTableToolbarProps<TData>) {
  const queryClient = useQueryClient();
  const isFiltered = table.getState().columnFilters.length > 0;
  const [filterValue, setFilterValue] = useState<string>("");
  const debouncedFilter = useDebounce(filterValue, 300);

  useEffect(() => {
    table.getColumn("provider")?.setFilterValue(debouncedFilter);
  }, [debouncedFilter, table]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by provider..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setFilterValue("");
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleRefresh}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
