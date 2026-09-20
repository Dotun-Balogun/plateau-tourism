"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const icon = formData.get("icon")?.toString().trim() || null;

  if (!name) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    slug: slugify(name),
    name,
    description,
    icon,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true };
}
