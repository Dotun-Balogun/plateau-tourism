import Link from "next/link";
import { ArrowRight, Compass, MapPinned, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DestinationCard,
  type DestinationCardData,
} from "@/components/destinations/destination-card";
import { createClient } from "@/lib/supabase/server";

async function getFeaturedDestinations(): Promise<DestinationCardData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("destinations")
      .select(
        "slug, name, summary, region, cover_image_url, avg_rating, review_count"
      )
      .eq("is_published", true)
      .order("avg_rating", { ascending: false })
      .limit(6);

    if (error) throw error;

    return (data ?? []).map((d) => ({
      slug: d.slug,
      name: d.name,
      summary: d.summary,
      region: d.region,
      cover_image_url: d.cover_image_url,
      avg_rating: d.avg_rating,
      review_count: d.review_count,
      category_name: null,
    }));
  } catch {
    // Supabase isn't configured yet, or the DB hasn't been migrated —
    // fail soft so the homepage still renders during initial setup.
    return [];
  }
}

const HIGHLIGHTS = [
  {
    icon: Compass,
    title: "Curated destinations",
    body: "Every listing is reviewed for accuracy: location, category, and rich media.",
  },
  {
    icon: Sparkles,
    title: "Photo & video galleries",
    body: "Browse destinations through immersive multimedia before you go.",
  },
  {
    icon: MapPinned,
    title: "Build your itinerary",
    body: "Save favorites and assemble a day-by-day trip plan you can share.",
  },
];

export default async function Home() {
  const destinations = await getFeaturedDestinations();

  return (
    <div>
      <section className="border-b bg-gradient-to-br from-primary/15 via-background to-secondary/20">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Discover <span className="text-primary">Plateau State</span>, one story at a time
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            An integrated tourism multimedia system: browse destinations,
            explore photo and video galleries, and plan your itinerary — all
            in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/destinations">
                Explore destinations
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/itineraries">Plan a trip</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex flex-col gap-2">
                <item.icon className="size-6 text-primary" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured destinations</h2>
            <p className="text-sm text-muted-foreground">
              Top-rated places to start exploring.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/destinations">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {destinations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No destinations yet. Once Supabase is connected and migrated,
              run <code className="rounded bg-muted px-1.5 py-0.5">npm run db:seed</code>{" "}
              (or apply <code className="rounded bg-muted px-1.5 py-0.5">supabase/seed.sql</code>)
              to populate sample data.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
