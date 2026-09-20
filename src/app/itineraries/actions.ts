"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function createItinerary(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const startsOn = formData.get("startsOn")?.toString() || null;
  const endsOn = formData.get("endsOn")?.toString() || null;

  if (!title) {
    return { error: "Title is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase.from("itineraries").insert({
    user_id: user.id,
    title,
    starts_on: startsOn,
    ends_on: endsOn,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/itineraries");
  return { success: true };
}
