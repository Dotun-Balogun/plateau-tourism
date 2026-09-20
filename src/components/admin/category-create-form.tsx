"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/app/admin/categories/actions";

export function CategoryCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Category created");
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="cat-name">Name</Label>
          <Input id="cat-name" name="name" required placeholder="Waterfalls" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-icon">Icon (lucide name, optional)</Label>
          <Input id="cat-icon" name="icon" placeholder="Waves" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cat-description">Description</Label>
        <Input id="cat-description" name="description" placeholder="Short description" />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add category"}
      </Button>
    </form>
  );
}
