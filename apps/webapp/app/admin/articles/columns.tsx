"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ArticleDto } from "@/generated/http-clients/backend";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, ExternalLink, RefreshCw } from "lucide-react";
import { scrapeArticle } from "./actions";
import { useToast } from "@/hooks/use-toast";

export const columns: ColumnDef<ArticleDto>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.image?.url;
      return imageUrl ? (
        <div className="relative h-12 w-20">
          <img
            src={imageUrl}
            alt="Article thumbnail"
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-12 w-20 bg-muted rounded-md" />
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.categories.map((category) => (
          <Badge key={category} variant="secondary">
            {category}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.content && <Badge variant="secondary">Scraped</Badge>}
        {row.original.enrichment && <Badge variant="default">Enriched</Badge>}
      </div>
    ),
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue("publishedAt"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPp"),
  },
  {
    accessorKey: "url",
    header: "Link",
    cell: ({ row }) => {
      const url = row.getValue("url") as string;
      return (
        <a
          href={url}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1"
        >
          Open
          <ExternalLink className="h-4 w-4" />
        </a>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const article = row.original;

      const handleScrape = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
          await scrapeArticle({
            url: article.url,
            provider: article.source,
          });
          toast({
            title: "Success",
            description: "Article queued for scraping",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to queue article for scraping",
            variant: "destructive",
          });
        }
      };

      if (!article.content) {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={handleScrape}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Scrape
          </Button>
        );
      }

      return null;
    },
  },
];
