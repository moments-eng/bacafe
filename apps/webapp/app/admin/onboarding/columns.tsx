"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OnboardingDto } from "@/generated/http-clients/backend";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingOperations {
  onPromote: (onboarding: OnboardingDto) => void;
  onDelete: (onboarding: OnboardingDto) => void;
}

export const createColumns = ({
  onPromote,
  onDelete,
}: OnboardingOperations): ColumnDef<OnboardingDto>[] => {
  const router = useRouter();

  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "articles",
      header: "Articles Count",
      cell: ({ row }) => {
        return <div>{row.original.articles.length}</div>;
      },
    },
    {
      accessorKey: "isProduction",
      header: "Status",
      cell: ({ row }) => {
        return row.original.isProduction ? (
          <Badge variant="default" className="bg-green-500">
            Production
          </Badge>
        ) : (
          <Badge variant="outline">Draft</Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return (
          <div>
            {format(new Date(row.original.createdAt), "MMM dd, yyyy HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        return (
          <div>
            {format(new Date(row.original.updatedAt), "MMM dd, yyyy HH:mm")}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const onboarding = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/onboarding/${onboarding.id}`)
                }
              >
                Edit
              </DropdownMenuItem>
              {!onboarding.isProduction && (
                <>
                  <DropdownMenuItem onClick={() => onPromote(onboarding)}>
                    Promote to Production
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(onboarding)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
