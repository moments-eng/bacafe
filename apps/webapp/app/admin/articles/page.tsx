"use client";

import { ArticleDetailView } from "@/components/article-detail-view";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  ArticleDto,
  ArticleFilterDto,
  ArticleSortDto,
} from "@/generated/http-clients/backend";
import { useToast } from "@/hooks/use-toast";
import { QUERY_KEYS } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import {
  type PaginationState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useMemo, useCallback } from "react";
import { getArticleStats, queryArticles } from "./actions";
import { columns } from "./columns";
import { ArticlesTableToolbar } from "./toolbar";

export default function ArticlesPage() {
  const { toast } = useToast();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedArticle, setSelectedArticle] = useState<ArticleDto>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [filters, setFilters] = useState<ArticleFilterDto>({});
  const [sorting, setSorting] = useState<ArticleSortDto>({ createdAt: "desc" });

  const { data, isLoading } = useQuery({
    queryKey: [
      QUERY_KEYS.ARTICLES,
      pagination.pageIndex,
      pagination.pageSize,
      filters,
      sorting,
    ],
    queryFn: () =>
      queryArticles({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filter: filters,
        sort: sorting,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: [QUERY_KEYS.ARTICLE_STATS],
    queryFn: () => getArticleStats(),
  });

  const tableSorting = useMemo(
    () =>
      Object.entries(sorting).map(([id, dir]) => ({
        id,
        desc: dir === "desc",
      })),
    [sorting]
  );

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(tableSorting)
          : updaterOrValue;
      const sortState = Array.isArray(newSorting) ? newSorting[0] : undefined;
      const newSortObject = sortState
        ? { [sortState.id]: sortState.desc ? "desc" : "asc" }
        : {};
      if (JSON.stringify(newSortObject) !== JSON.stringify(sorting)) {
        setSorting(newSortObject);
      }
    },
    [sorting, tableSorting]
  );

  const table = useReactTable<ArticleDto>({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: handleSortingChange,
    onPaginationChange: setPagination,
    pageCount: data?.totalPages ?? -1,
    state: {
      sorting: tableSorting,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
  });

  const handleResetFilters = () => {
    setFilters({});
    setSorting({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Articles</h2>
          <p className="text-muted-foreground">
            View and manage scraped articles
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="border p-4 rounded-lg">
          <h3 className="text-sm font-medium">Total Articles</h3>
          <p className="text-2xl font-bold">{stats?.totalArticles || 0}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-sm font-medium">Scraped</h3>
          <p className="text-2xl font-bold">{stats?.scrapedCount || 0}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-sm font-medium">Enriched</h3>
          <p className="text-2xl font-bold">{stats?.enrichedCount || 0}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-sm font-medium">Providers</h3>
          <p className="text-2xl font-bold">{stats?.providers?.length || 0}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-sm font-medium">Active Providers</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {stats?.providers?.map((provider) => (
              <Badge key={provider} variant="outline">
                {provider}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ArticlesTableToolbar
          filters={filters}
          sorting={sorting}
          onFilterChange={setFilters}
          onSortChange={setSorting}
          onReset={handleResetFilters}
        />
        <div className="rounded-md border">
          <DataTable<ArticleDto, unknown>
            columns={columns}
            data={data?.items || []}
            emptyMessage="No articles found"
            isLoading={isLoading}
            onRowClick={(row) => {
              setSelectedArticle(row);
              setDetailOpen(true);
            }}
          />
        </div>
        <DataTablePagination
          table={table}
          isLoading={isLoading}
          totalItems={data?.total || 0}
        />
      </div>

      <ArticleDetailView
        article={selectedArticle}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
