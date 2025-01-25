"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { components } from "@/lib/http-clients/backend/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ArticleDto = components["schemas"]["ArticleDto"];

interface Props {
  article: ArticleDto;
  position: number;
  onRemove?: (articleId: string) => void;
}

export function SortableArticleItem({ article, position, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: article.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">Position {position}</Badge>
              <Badge variant="secondary">{article.source}</Badge>
            </div>
            <h3 className="mb-1 font-semibold">{article.title}</h3>
            <p className="text-sm text-muted-foreground">
              {article.description}
            </p>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onRemove(article.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
