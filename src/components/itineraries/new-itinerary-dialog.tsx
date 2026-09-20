"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createItinerary } from "@/app/itineraries/actions";

export function NewItineraryDialog() {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createItinerary(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Itinerary created");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          New itinerary
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New itinerary</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="Weekend in Jos" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startsOn">Start date</Label>
              <Input id="startsOn" name="startsOn" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endsOn">End date</Label>
              <Input id="endsOn" name="endsOn" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create itinerary"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
