"use client";

import { IntervalDialog } from "@/components/admin/feeds/interval-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FeedDto } from "@/generated/http-clients/backend";
import { useToast } from "@/hooks/use-toast";
import { QUERY_KEYS } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Clock, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteFeed, triggerScrape, updateFeedStatus } from "./client-actions";

export const columns: ColumnDef<FeedDto>[] = [
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.provider}
        <div className="text-sm text-muted-foreground">
          {row.original.categories?.map((c: string) => (
            <Badge key={c} variant="outline" className="mr-1">
              {c}
            </Badge>
          ))}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Feed Name",
  },
  {
    accessorKey: "url",
    header: "RSS URL",
    cell: ({ row }) => (
      <a
        href={row.original.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {row.original.url}
      </a>
    ),
  },
  {
    accessorKey: "scrapingInterval",
    header: "Interval",
    cell: ({ row }) => {
      const queryClient = useQueryClient();

      const handleIntervalSave = async (newInterval: number) => {
        await updateFeedStatus(row.original.id, {
          isActive: newInterval > 0 ? row.original.isActive : false,
          scrapingInterval: newInterval,
        });

        // Invalidate and refetch
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
      };

      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <IntervalDialog
            feedId={row.original.id}
            currentInterval={row.original.scrapingInterval}
            isActive={row.original.isActive}
            onSave={handleIntervalSave}
          />
          <span>
            {row.original.scrapingInterval > 0
              ? `${row.original.scrapingInterval}m`
              : "Inactive"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastScrapedAt",
    header: "Last Scraped",
    cell: ({ row }) =>
      row.original.lastScrapedAt
        ? formatDistanceToNow(new Date(row.original.lastScrapedAt), {
            addSuffix: true,
          })
        : "Never",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const { toast } = useToast();
      const queryClient = useQueryClient();
      const [isUpdating, setIsUpdating] = useState(false);

      const { mutate } = useMutation({
        mutationFn: (checked: boolean) =>
          updateFeedStatus(row.original.id, {
            isActive: checked,
            scrapingInterval: row.original.scrapingInterval,
          }),
        onMutate: () => setIsUpdating(true),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to update status",
            variant: "destructive",
          });
        },
        onSettled: () => setIsUpdating(false),
      });

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.original.isActive}
            onCheckedChange={mutate}
            disabled={isUpdating}
          />
          <Badge variant={row.original.isActive ? "default" : "secondary"}>
            {row.original.isActive ? "Active" : "Paused"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const queryClient = useQueryClient();
      const [isDeleting, setIsDeleting] = useState(false);
      const [isScraping, setIsScraping] = useState(false);

      const deleteMutation = useMutation({
        mutationFn: () => deleteFeed(row.original.id),
        onMutate: () => setIsDeleting(true),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to delete feed",
            variant: "destructive",
          });
        },
        onSettled: () => setIsDeleting(false),
      });

      const scrapeMutation = useMutation({
        mutationFn: () => triggerScrape(row.original.id),
        onMutate: () => setIsScraping(true),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
          toast({
            title: "Scraping initiated",
            description: "Feed scraping started successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to start scraping",
            variant: "destructive",
          });
        },
        onSettled: () => setIsScraping(false),
      });

      return (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrapeMutation.mutate()}
            disabled={isScraping}
          >
            <Play className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteMutation.mutate()}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
