"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteDestination, togglePublish } from "@/app/admin/destinations/actions";

export function DestinationRowActions({
  destinationId,
  isPublished,
}: {
  destinationId: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      const result = await togglePublish(destinationId, checked);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteDestination(destinationId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Destination deleted");
      router.refresh();
    });
  }

  return (
    <div className="flex shrink-0 items-center gap-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={isPublished}
          onCheckedChange={handleToggle}
          disabled={isPending}
        />
        <span className="text-sm text-muted-foreground">Published</span>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this destination?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the destination and all of its
              media and reviews. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
