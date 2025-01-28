"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArticleFilterDto,
  ArticleSortDto,
} from "@/generated/http-clients/backend";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FilterX } from "lucide-react";

interface ArticlesTableToolbarProps {
  filters: ArticleFilterDto;
  sorting: ArticleSortDto;
  onFilterChange: (filters: ArticleFilterDto) => void;
  onSortChange: (sort: ArticleSortDto) => void;
  onReset: () => void;
}

export function ArticlesTableToolbar({
  filters,
  sorting,
  onFilterChange,
  onSortChange,
  onReset,
}: ArticlesTableToolbarProps) {
  const hasFilters = Object.keys(filters).length > 0;

  const getSortValue = () => {
    const [field, direction] = Object.entries(sorting)[0] || [];
    return field && direction ? `${field}-${direction}` : "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search titles..."
          value={filters.title || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, title: e.target.value })
          }
          className="max-w-xs"
        />

        <Select
          value={filters.source || ""}
          onValueChange={(value: string) =>
            onFilterChange({ ...filters, source: value || undefined })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ynet">Ynet</SelectItem>
            <SelectItem value="mako">Mako</SelectItem>
            <SelectItem value="techcrunch">TechCrunch</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[240px] justify-start text-left font-normal",
                (filters.publishedAtFrom || filters.publishedAtTo) &&
                  "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <div className="flex-1 truncate">
                {filters.publishedAtFrom || filters.publishedAtTo ? (
                  <>
                    {filters.publishedAtFrom &&
                      format(new Date(filters.publishedAtFrom), "PPP")}
                    {" - "}
                    {filters.publishedAtTo &&
                      format(new Date(filters.publishedAtTo), "PPP")}
                  </>
                ) : (
                  <span>Publication date</span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: filters.publishedAtFrom
                  ? new Date(filters.publishedAtFrom)
                  : undefined,
                to: filters.publishedAtTo
                  ? new Date(filters.publishedAtTo)
                  : undefined,
              }}
              onSelect={(range) => {
                onFilterChange({
                  ...filters,
                  publishedAtFrom: range?.from?.toISOString(),
                  publishedAtTo: range?.to?.toISOString(),
                });
              }}
            />
          </PopoverContent>
        </Popover>

        <Select
          value={getSortValue()}
          onValueChange={(value: string) => {
            const [field, order] = value.split("-");
            onSortChange({ [field]: order as "asc" | "desc" });
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="publishedAt-desc">
              Publication Date (Newest)
            </SelectItem>
            <SelectItem value="publishedAt-asc">
              Publication Date (Oldest)
            </SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={onReset}>
            <FilterX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {filters.categories && filters.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  categories: filters.categories?.filter((c) => c !== category),
                })
              }
            >
              {category}
              <FilterX className="ml-2 h-4 w-4" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
