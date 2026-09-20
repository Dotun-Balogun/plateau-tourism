import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserWithProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}

export function isStaffRole(role: string | undefined | null) {
  return role === "editor" || role === "admin";
}
