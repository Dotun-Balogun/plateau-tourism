import Link from "next/link";
import { Compass } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DestinationCard,
  type DestinationCardData,
} from "@/components/destinations/destination-card";
import { createClient } from "@/lib/supabase/server";

type Category = { slug: string; name: string };

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug, name")
      .order("name");
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

async function getDestinations(categorySlug?: string): Promise<DestinationCardData[]> {
  try {
    const supabase = await createClient();

    let categoryId: string | null = null;
    if (categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      categoryId = category?.id ?? null;
      if (!categoryId) return [];
    }

    let query = supabase
      .from("destinations")
      .select(
        "slug, name, summary, region, cover_image_url, avg_rating, review_count"
      )
      .eq("is_published", true)
      .order("name");

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((d) => ({ ...d, category_name: null }));
  } catch {
    return [];
  }
}

export default async function DestinationsPage({
  searchParams,
}: PageProps<"/destinations">) {
  const params = await searchParams;
  const categorySlug =
    typeof params.category === "string" ? params.category : undefined;

  const [categories, destinations] = await Promise.all([
    getCategories(),
    getDestinations(categorySlug),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {activeCategory ? activeCategory.name : "All destinations"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {destinations.length} {destinations.length === 1 ? "place" : "places"} to explore
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/destinations">
            <Badge variant={!categorySlug ? "default" : "outline"}>All</Badge>
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/destinations?category=${c.slug}`}>
              <Badge variant={categorySlug === c.slug ? "default" : "outline"}>
                {c.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {destinations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Compass className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No destinations found yet. Once Supabase is connected and
              seeded (<code className="rounded bg-muted px-1.5 py-0.5">pnpm db:reset</code>{" "}
              locally, or{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">
                supabase db query --file supabase/seed.sql --linked
              </code>{" "}
              on a hosted project), they&apos;ll show up here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
