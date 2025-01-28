"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArticleDto,
  OnboardingArticleDto as OnboardingArticleDtoType,
} from "@/generated/http-clients/backend";
import { useToast } from "@/hooks/use-toast";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { queryArticles } from "../articles/actions";
import { createOnboarding } from "./actions";
import { SortableArticleItem } from "./sortable-article-item";

type OnboardingArticleDto = OnboardingArticleDtoType & {
  title: string;
};

interface CreateOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateOnboardingDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateOnboardingDialogProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticles, setSelectedArticles] = useState<
    OnboardingArticleDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Reset state when dialog is closed
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedArticles([]);
      setIsLoading(false);
    }
  }, [open]);

  // Fetch articles with search query
  const { data: articles } = useQuery({
    queryKey: ["articles", searchQuery],
    queryFn: () => queryArticles({ filter: { title: searchQuery } }),
    enabled: open,
  });

  const handleArticleSelect = (article: ArticleDto) => {
    if (!selectedArticles.find((a) => a.articleId === article.id)) {
      setSelectedArticles([
        ...selectedArticles,
        {
          articleId: article.id,
          position: selectedArticles.length,
          title: article.title,
        },
      ]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedArticles((items) => {
        const oldIndex = items.findIndex(
          (item) => item.articleId === active.id
        );
        const newIndex = items.findIndex((item) => item.articleId === over.id);

        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        return reorderedItems.map((item, index) => ({
          ...item,
          position: index,
        }));
      });
    }
  };

  const handleRemoveArticle = (articleId: string) => {
    setSelectedArticles((items) => {
      const newItems = items.filter((item) => item.articleId !== articleId);
      return newItems.map((item, index) => ({
        ...item,
        position: index,
      }));
    });
  };

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      // Remove title from the payload as it's not part of the DTO
      const articlesPayload = selectedArticles.map(
        ({ title, ...rest }) => rest
      );
      await createOnboarding({ articles: articlesPayload });
      toast({
        title: "Success",
        description: "Onboarding created successfully",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create onboarding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Onboarding</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Article Search Section */}
          <div>
            <Label>Search Articles</Label>
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[400px] mt-2 border rounded-md">
              <div className="p-4">
                {articles?.items.map((article: ArticleDto) => (
                  <div
                    key={article.id}
                    className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-muted"
                    onClick={() => handleArticleSelect(article)}
                  >
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {article.source}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Articles Section */}
          <div>
            <Label>Selected Articles (Drag to reorder)</Label>
            <ScrollArea className="h-[400px] mt-2 border rounded-md">
              <div className="p-4">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={selectedArticles.map((a) => a.articleId)}
                    strategy={verticalListSortingStrategy}
                  >
                    {selectedArticles.map((article, index) => (
                      <SortableArticleItem
                        key={article.articleId}
                        article={
                          {
                            id: article.articleId,
                            title: article.title,
                          } as ArticleDto
                        }
                        position={index}
                        onRemove={() => handleRemoveArticle(article.articleId)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={selectedArticles.length === 0 || isLoading}
          >
            {isLoading ? "Creating..." : "Create Onboarding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
