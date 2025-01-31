import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ArticleDto } from "@/generated/http-clients/backend";

export function ArticleDetailView({
  article,
  open,
  onOpenChange,
}: {
  article?: ArticleDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{article.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {article.image && (
              <img
                src={article.image.url}
                alt="Article"
                className="rounded-lg w-full h-64 object-cover"
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Source</h3>
                <p>{article.source}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Published Date</h3>
                <p>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Author</h3>
                <p>{article.author || "Unknown"}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Categories</h3>
                <p>{article.categories.join(", ")}</p>
              </div>
            </div>

            {article.description && (
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{article.description}</p>
              </div>
            )}

            {article.content && (
              <div className="space-y-2">
                <h3 className="font-semibold">Content</h3>
                <div
                  className="prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            )}

            {article.enrichment && (
              <div className="space-y-2">
                <h3 className="font-semibold">Enrichment Data</h3>
                <pre className="bg-muted rounded-lg p-4 text-sm overflow-auto">
                  {JSON.stringify(article.enrichment, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
