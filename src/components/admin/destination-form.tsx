"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActionResult } from "@/app/admin/destinations/actions";

type Category = { id: string; name: string };

type DestinationDefaults = {
  name?: string;
  summary?: string | null;
  description?: string | null;
  region?: string | null;
  country?: string | null;
  categoryId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isPublished?: boolean;
};

export function DestinationForm({
  categories,
  defaults,
  action,
  submitLabel = "Save",
}: {
  categories: Category[];
  defaults?: DestinationDefaults;
  action: (prev: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  React.useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) toast.success("Saved");
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={defaults?.name} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="summary">Short summary</Label>
        <Input
          id="summary"
          name="summary"
          defaultValue={defaults?.summary ?? ""}
          placeholder="One sentence shown on cards"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Full description</Label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={defaults?.description ?? ""}
          className="border-input dark:bg-input/30 flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="region">Region / LGA</Label>
          <Input id="region" name="region" defaultValue={defaults?.region ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            defaultValue={defaults?.country ?? "Nigeria"}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={defaults?.latitude ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={defaults?.longitude ?? ""}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="categoryId">Category</Label>
        <Select name="categoryId" defaultValue={defaults?.categoryId ?? undefined}>
          <SelectTrigger id="categoryId" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="isPublished"
          name="isPublished"
          defaultChecked={defaults?.isPublished ?? false}
        />
        <Label htmlFor="isPublished">Published (visible to visitors)</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
