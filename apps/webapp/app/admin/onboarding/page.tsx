"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OnboardingDto } from "@/generated/http-clients/backend";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  deleteOnboarding,
  getOnboardings,
  promoteToProduction,
} from "./actions";
import { createColumns } from "./columns";
import { CreateOnboardingDialog } from "./create-onboarding-dialog";

export default function OnboardingPage() {
  const { toast } = useToast();
  const [selectedOnboarding, setSelectedOnboarding] =
    useState<OnboardingDto | null>(null);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    isLoading: isTableLoading,
    refetch,
  } = useQuery({
    queryKey: ["onboardings"],
    queryFn: () => getOnboardings({ page: 1, limit: 10 }),
  });

  const handlePromoteToProduction = async () => {
    if (!selectedOnboarding) return;

    try {
      setIsLoading(true);
      await promoteToProduction(selectedOnboarding.id);
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

  const handleDelete = async () => {
    if (!selectedOnboarding) return;

    try {
      setIsLoading(true);
      await deleteOnboarding(selectedOnboarding.id);
      setIsDeleteDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Onboarding deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete onboarding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = createColumns({
    onPromote: (onboarding) => {
      setSelectedOnboarding(onboarding);
      setIsPromoteDialogOpen(true);
    },
    onDelete: (onboarding) => {
      setSelectedOnboarding(onboarding);
      setIsDeleteDialogOpen(true);
    },
  });

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Onboarding Management
          </h2>
          <p className="text-muted-foreground">
            Manage your onboarding flows and promote them to production
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Onboarding
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        isLoading={isTableLoading}
      />

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

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Onboarding</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this onboarding? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateOnboardingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
