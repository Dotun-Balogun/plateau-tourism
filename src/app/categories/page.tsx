import Link from "next/link";
import type { ComponentType } from "react";
import * as Icons from "lucide-react";
import { Compass } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type CategoryRow = {
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
};

async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug, name, description, icon")
      .order("name");
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

function CategoryIcon({ name }: { name: string | null }) {
  const IconComponent =
    (name &&
      (Icons as unknown as Record<string, ComponentType<{ className?: string }>>)[
        name
      ]) ||
    Compass;
  return <IconComponent className="size-6 text-primary" />;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="mt-1 text-muted-foreground">
          Browse destinations by theme.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.slug} href={`/destinations?category=${c.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="space-y-2">
                  <CategoryIcon name={c.icon} />
                  <h3 className="font-semibold">{c.name}</h3>
                  {c.description && (
                    <p className="text-sm text-muted-foreground">
                      {c.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No categories yet — seed your database to see them here.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
