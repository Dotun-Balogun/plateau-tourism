import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DestinationForm } from "@/components/admin/destination-form";
import { MediaManager } from "@/components/admin/media-manager";
import { updateDestination } from "@/app/admin/destinations/actions";
import { createClient } from "@/lib/supabase/server";

async function getData(id: string) {
  const supabase = await createClient();

  const [{ data: destination }, { data: categories }, { data: media }] =
    await Promise.all([
      supabase.from("destinations").select("*").eq("id", id).maybeSingle(),
      supabase.from("categories").select("id, name").order("name"),
      supabase
        .from("media_assets")
        .select("id, kind, storage_path, caption")
        .eq("destination_id", id)
        .order("position"),
    ]);

  return { destination, categories: categories ?? [], media: media ?? [] };
}

export default async function EditDestinationPage({
  params,
}: PageProps<"/admin/destinations/[id]">) {
  const { id } = await params;
  const { destination, categories, media } = await getData(id);

  if (!destination) notFound();

  const boundUpdate = updateDestination.bind(null, id);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit {destination.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          /destinations/{destination.slug}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DestinationForm
            categories={categories}
            defaults={{
              name: destination.name,
              summary: destination.summary,
              description: destination.description,
              region: destination.region,
              country: destination.country,
              categoryId: destination.category_id,
              latitude: destination.latitude,
              longitude: destination.longitude,
              isPublished: destination.is_published,
            }}
            action={boundUpdate}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Photos & video</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaManager destinationId={destination.id} initialMedia={media} />
        </CardContent>
      </Card>
    </div>
  );
}
