"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/app/admin/categories/actions";

export function CategoryDeleteButton({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="icon" disabled={isPending} onClick={handleDelete}>
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}
