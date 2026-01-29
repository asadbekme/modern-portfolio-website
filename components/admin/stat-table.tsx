"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { statService } from "@/services/stat-service";
import { Stat } from "@/types/stat";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { StatForm } from "./stat-form";
import { Badge } from "@/components/ui/badge";

export function StatsTable() {
  const queryClient = useQueryClient();
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [deletingStat, setDeletingStat] = useState<Stat | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: statService.getAllStats,
  });

  const deleteMutation = useMutation({
    mutationFn: (stat: Stat) => statService.deleteStat(stat.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Stat deleted successfully!");
      setDeletingStat(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete stat: ${error.message}`);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      statService.togglePublish(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Stat status updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const columns: ColumnDef<Stat>[] = [
    {
      accessorKey: "order_index",
      header: "#",
      cell: ({ row }) => (
        <div className="w-8">{row.getValue("order_index")}</div>
      ),
    },
    {
      accessorKey: "number",
      header: "Value",
      cell: ({ row }) => (
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {row.getValue("number")}
        </div>
      ),
    },
    {
      accessorKey: "label_en",
      header: "Label (EN)",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.getValue("label_en")}</div>
          <div className="text-xs text-gray-500 truncate">
            {row.original.label_uz}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "is_published",
      header: "Status",
      cell: ({ row }) => {
        const isPublished = row.getValue("is_published") as boolean;
        return (
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const stat = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingStat(stat)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  togglePublishMutation.mutate({
                    id: stat.id,
                    isPublished: !stat.is_published,
                  })
                }
              >
                {stat.is_published ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingStat(stat)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={stats}
        searchKey="label_en"
        searchPlaceholder="Filter stats..."
        toolbar={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Stat
          </Button>
        }
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Stat</DialogTitle>
            <DialogDescription>
              Add a statistic to display on the skills section
            </DialogDescription>
          </DialogHeader>
          <StatForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingStat} onOpenChange={() => setEditingStat(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Stat</DialogTitle>
            <DialogDescription>Update statistic information</DialogDescription>
          </DialogHeader>
          {editingStat && (
            <StatForm
              stat={editingStat}
              onSuccess={() => setEditingStat(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingStat} onOpenChange={() => setDeletingStat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Stat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingStat?.number} -{" "}
              {deletingStat?.label_en}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeletingStat(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletingStat && deleteMutation.mutate(deletingStat)
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
