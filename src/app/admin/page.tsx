import Link from "next/link";
import { FolderTree, MapPin, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  try {
    const supabase = await createClient();
    const [{ count: destinationCount }, { count: categoryCount }, { count: reviewCount }] =
      await Promise.all([
        supabase.from("destinations").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
      ]);
    return {
      destinations: destinationCount ?? 0,
      categories: categoryCount ?? 0,
      reviews: reviewCount ?? 0,
    };
  } catch {
    return { destinations: 0, categories: 0, reviews: 0 };
  }
}

export default async function AdminOverviewPage() {
  const counts = await getCounts();

  const stats = [
    { label: "Destinations", value: counts.destinations, href: "/admin/destinations", icon: MapPin },
    { label: "Categories", value: counts.categories, href: "/admin/categories", icon: FolderTree },
    { label: "Reviews", value: counts.reviews, href: "/destinations", icon: Star },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      <p className="mt-1 text-muted-foreground">
        Manage destinations, categories, and media for the platform.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
                <s.icon className="size-8 text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
