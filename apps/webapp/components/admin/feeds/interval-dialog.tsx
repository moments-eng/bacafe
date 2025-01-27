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
import { cn } from "@/lib/utils";
import { useState } from "react";

interface IntervalDialogProps {
  feedId: string;
  currentInterval: number;
  isActive: boolean;
  onSave: (newInterval: number) => Promise<void>;
}

export function IntervalDialog({
  feedId,
  currentInterval,
  isActive,
  onSave,
}: IntervalDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [interval, setInterval] = useState(currentInterval.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const numericValue = Number.parseInt(interval);

      if (Number.isNaN(numericValue) || numericValue < -1) {
        throw new Error("Invalid interval value");
      }

      await onSave(numericValue);

      toast({
        title: "Success",
        description: "Scraping interval updated successfully",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update interval",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          Edit Interval
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Scraping Interval</DialogTitle>
          <DialogDescription>
            Set how often this feed should be scraped (in minutes)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interval" className="text-right">
              Interval
            </Label>
            <Input
              id="interval"
              type="number"
              min="-1"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div
            className={cn("text-sm text-muted-foreground", {
              "text-destructive": Number.parseInt(interval) < 0,
            })}
          >
            {Number.parseInt(interval) > 0 ? (
              `Feed will be scraped every ${interval} minutes`
            ) : Number.parseInt(interval) === 0 ? (
              <span className="text-destructive">Interval cannot be zero</span>
            ) : (
              "Feed scraping will be disabled"
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
