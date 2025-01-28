"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  addArticle,
  getOnboarding,
  promoteToProduction,
  removeArticle,
  updateArticlePositions,
} from "../actions";
import { AddArticleDialog } from "../add-article-dialog";
import { SortableArticleItem } from "../sortable-article-item";

export default function EditOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isAddArticleDialogOpen, setIsAddArticleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: onboarding, refetch } = useQuery({
    queryKey: ["onboarding", params.id],
    queryFn: () => getOnboarding(params.id as string),
  });

  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!onboarding) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find the items and their positions
      const oldItem = onboarding.articles.find(
        ({ article }) => article.id === active.id
      );
      const newItem = onboarding.articles.find(
        ({ article }) => article.id === over.id
      );

      if (!oldItem || !newItem) return;

      // Create a new array with updated positions
      const oldPosition = oldItem.position;
      const newPosition = newItem.position;

      // Optimistically update the UI
      const updatedArticles = onboarding.articles.map((item) => {
        if (item.article.id === active.id) {
          return { ...item, position: newPosition };
        }
        if (oldPosition < newPosition) {
          // Moving down: decrease positions of items in between
          if (item.position > oldPosition && item.position <= newPosition) {
            return { ...item, position: item.position - 1 };
          }
        } else {
          // Moving up: increase positions of items in between
          if (item.position >= newPosition && item.position < oldPosition) {
            return { ...item, position: item.position + 1 };
          }
        }
        return item;
      });

      // Immediately update the UI with new positions
      queryClient.setQueryData(["onboarding", params.id], {
        ...onboarding,
        articles: updatedArticles,
      });

      try {
        // Send the update to the server
        await updateArticlePositions(
          onboarding.id,
          updatedArticles.map(({ article, position }) => ({
            articleId: article.id,
            position,
          }))
        );

        // Show success toast
        toast({
          title: "Success",
          description: "Article order updated",
          variant: "default",
        });
      } catch (error) {
        // On error, revert the changes and show error toast
        const currentData = await refetch();
        queryClient.setQueryData(["onboarding", params.id], currentData.data);

        toast({
          title: "Error",
          description: "Failed to update article order",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddArticle = async (articleId: string) => {
    if (!onboarding) return;

    try {
      setIsLoading(true);
      const nextPosition =
        Math.max(...onboarding.articles.map((a) => a.position), 0) + 1;
      await addArticle(onboarding.id, { articleId, position: nextPosition });
      setIsAddArticleDialogOpen(false);
      await refetch();
      toast({
        title: "Success",
        description: "Article added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add article",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveArticle = async (articleId: string) => {
    if (!onboarding) return;

    try {
      setIsLoading(true);
      await removeArticle(onboarding.id, articleId);
      await refetch();
      toast({
        title: "Success",
        description: "Article removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove article",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteToProduction = async () => {
    if (!onboarding) return;

    try {
      setIsLoading(true);
      await promoteToProduction(onboarding.id);
      setIsPromoteDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Onboarding promoted to production successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote onboarding to production",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!onboarding) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/admin/onboarding")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Onboarding List
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Edit Onboarding
            </h2>
            <p className="text-muted-foreground">
              Manage articles and settings for this onboarding flow
            </p>
          </div>
          {!onboarding.isProduction && (
            <Button onClick={() => setIsPromoteDialogOpen(true)}>
              Promote to Production
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Onboarding Info */}
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              {onboarding.isProduction ? (
                <Badge variant="default" className="bg-green-500">
                  Production
                </Badge>
              ) : (
                <Badge variant="outline">Draft</Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Created At</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(onboarding.createdAt), "PPpp")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(onboarding.updatedAt), "PPpp")}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Articles Count</p>
              <p className="text-2xl font-bold">{onboarding.articles.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Articles Order</CardTitle>
            {!onboarding.isProduction && (
              <Button onClick={() => setIsAddArticleDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Article
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={onboarding.articles
                    .sort((a, b) => a.position - b.position)
                    .map(({ article }) => article.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {onboarding.articles
                    .sort((a, b) => a.position - b.position)
                    .map(({ article, position }) => (
                      <SortableArticleItem
                        key={article.id}
                        article={article}
                        position={position}
                        onRemove={
                          !onboarding.isProduction
                            ? handleRemoveArticle
                            : undefined
                        }
                      />
                    ))}
                </SortableContext>
              </DndContext>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Promote Dialog */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote to Production</DialogTitle>
            <DialogDescription>
              Are you sure you want to promote this onboarding to production?
              This will replace the current production onboarding.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPromoteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handlePromoteToProduction} disabled={isLoading}>
              {isLoading ? "Promoting..." : "Promote to Production"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Article Dialog */}
      <AddArticleDialog
        open={isAddArticleDialogOpen}
        onOpenChange={setIsAddArticleDialogOpen}
        onSubmit={handleAddArticle}
        isLoading={isLoading}
      />
    </div>
  );
}
