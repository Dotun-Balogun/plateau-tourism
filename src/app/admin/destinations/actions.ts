"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type ActionResult = { error?: string; success?: boolean; id?: string };

export async function createDestination(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get("name")?.toString().trim();
  const summary = formData.get("summary")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const region = formData.get("region")?.toString().trim() || null;
  const country = formData.get("country")?.toString().trim() || "Nigeria";
  const categoryId = formData.get("categoryId")?.toString() || null;
  const latitude = formData.get("latitude")?.toString();
  const longitude = formData.get("longitude")?.toString();
  const isPublished = formData.get("isPublished") === "on";

  if (!name) return { error: "Name is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("destinations")
    .insert({
      slug: slugify(name),
      name,
      summary,
      description,
      region,
      country,
      category_id: categoryId,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      is_published: isPublished,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  redirect(`/admin/destinations/${data.id}`);
}

export async function updateDestination(
  destinationId: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get("name")?.toString().trim();
  const summary = formData.get("summary")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const region = formData.get("region")?.toString().trim() || null;
  const country = formData.get("country")?.toString().trim() || "Nigeria";
  const categoryId = formData.get("categoryId")?.toString() || null;
  const latitude = formData.get("latitude")?.toString();
  const longitude = formData.get("longitude")?.toString();
  const isPublished = formData.get("isPublished") === "on";

  if (!name) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("destinations")
    .update({
      name,
      summary,
      description,
      region,
      country,
      category_id: categoryId,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      is_published: isPublished,
    })
    .eq("id", destinationId);

  if (error) return { error: error.message };

  revalidatePath("/admin/destinations");
  revalidatePath(`/admin/destinations/${destinationId}`);
  revalidatePath("/destinations");
  return { success: true };
}

export async function deleteDestination(destinationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("destinations")
    .delete()
    .eq("id", destinationId);

  if (error) return { error: error.message };

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return { success: true };
}

export async function togglePublish(destinationId: string, isPublished: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("destinations")
    .update({ is_published: isPublished })
    .eq("id", destinationId);

  if (error) return { error: error.message };

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return { success: true };
}

export async function attachMedia(
  destinationId: string,
  storagePath: string,
  kind: "image" | "video",
  caption: string | null
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("media_assets").insert({
    destination_id: destinationId,
    kind,
    storage_path: storagePath,
    caption,
    uploaded_by: user?.id ?? null,
  });

  if (error) return { error: error.message };

  // Use the first uploaded image as the cover if none is set yet.
  if (kind === "image") {
    const { data: destination } = await supabase
      .from("destinations")
      .select("cover_image_url")
      .eq("id", destinationId)
      .maybeSingle();

    if (destination && !destination.cover_image_url) {
      await supabase
        .from("destinations")
        .update({ cover_image_url: storagePath })
        .eq("id", destinationId);
    }
  }

  revalidatePath(`/admin/destinations/${destinationId}`);
  revalidatePath("/destinations");
  return { success: true };
}

export async function deleteMedia(mediaId: string, destinationId: string, storagePath: string) {
  const supabase = await createClient();

  // Storage path is stored as a public URL; extract the object path for removal.
  const marker = "/object/public/destination-media/";
  const idx = storagePath.indexOf(marker);
  if (idx !== -1) {
    const objectPath = storagePath.slice(idx + marker.length);
    await supabase.storage.from("destination-media").remove([objectPath]);
  }

  const { error } = await supabase.from("media_assets").delete().eq("id", mediaId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/destinations/${destinationId}`);
  revalidatePath("/destinations");
  return { success: true };
}
