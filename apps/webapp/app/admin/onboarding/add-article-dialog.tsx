"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArticleDto } from "@/generated/http-clients/backend";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { queryArticles } from "../articles/actions";
import { useDebounce } from "@/hooks/use-debounce";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (articleId: string) => void;
  isLoading: boolean;
}

export function AddArticleDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: Props) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleDto | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  useDebounce(
    () => {
      refetch();
    },
    [searchQuery],
    500
  );

  const { data: articles, refetch } = useQuery({
    queryKey: ["articles", searchQuery],
    queryFn: () =>
      queryArticles({
        page: 1,
        limit: 100,
        filter: searchQuery ? { title: searchQuery } : undefined,
        sort: { createdAt: "desc" },
      }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Article</DialogTitle>
          <DialogDescription>
            Select an article to add to the onboarding flow
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles by title..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {articles?.items.map((article) => (
              <Card
                key={article.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedArticle?.id === article.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedArticle(article)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary">{article.source}</Badge>
                    {article.author && (
                      <span className="text-sm text-muted-foreground">
                        by {article.author}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-1 font-semibold">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {article.description}
                  </p>
                </CardContent>
              </Card>
            ))}
            {articles?.items.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No articles found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedArticle && onSubmit(selectedArticle.id)}
            disabled={!selectedArticle || isLoading}
          >
            {isLoading ? "Adding..." : "Add Article"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
