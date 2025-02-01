"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createBulkFeeds } from "./client-actions";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface BulkFeedsDialogProps {
  onSuccess: () => void;
}

export function BulkFeedsDialog({ onSuccess }: BulkFeedsDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState("");
  const [urls, setUrls] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const { mutate: createFeeds, isPending } = useMutation({
    mutationFn: createBulkFeeds,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Created ${data.length} feeds successfully`,
      });
      setIsOpen(false);
      onSuccess();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create feeds",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setProvider("");
    setUrls("");
    setCategories([]);
    setNewCategory("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !urls) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createFeeds({
      provider,
      urls,
      categories,
    });
  };

  const handleAddCategory = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newCategory) {
      e.preventDefault();
      if (!categories.includes(newCategory)) {
        setCategories([...categories, newCategory]);
      }
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Bulk Add Feeds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Multiple RSS Feeds</DialogTitle>
            <DialogDescription>
              Add multiple RSS feeds for the same provider at once. Enter URLs
              separated by commas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="provider">Provider Name</Label>
              <Input
                id="provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g., ynet, mako"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="urls">RSS Feed URLs</Label>
              <Textarea
                id="urls"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="Enter URLs separated by commas"
                required
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categories">Categories</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                id="categories"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleAddCategory}
                placeholder="Type a category and press Enter"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Feeds"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
