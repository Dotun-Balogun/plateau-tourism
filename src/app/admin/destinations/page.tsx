import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { DestinationRowActions } from "@/components/admin/destination-row-actions";

type Row = {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  is_published: boolean;
  avg_rating: number;
  review_count: number;
};

async function getAllDestinations(): Promise<Row[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("id, slug, name, region, is_published, avg_rating, review_count")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export default async function AdminDestinationsPage() {
  const destinations = await getAllDestinations();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Destinations</h1>
          <p className="mt-1 text-muted-foreground">
            {destinations.length} total
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/destinations/new">
            <Plus className="size-4" />
            New destination
          </Link>
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {destinations.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/destinations/${d.id}`}
                    className="truncate font-medium hover:underline"
                  >
                    {d.name}
                  </Link>
                  <Badge variant={d.is_published ? "default" : "outline"}>
                    {d.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {d.region ?? "No region set"} · {d.review_count} reviews · {d.avg_rating.toFixed(1)}★
                </p>
              </div>
              <DestinationRowActions
                destinationId={d.id}
                isPublished={d.is_published}
              />
            </CardContent>
          </Card>
        ))}

        {destinations.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No destinations yet. Create your first one.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
