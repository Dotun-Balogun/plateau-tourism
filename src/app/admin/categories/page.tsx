import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { CategoryCreateForm } from "@/components/admin/category-create-form";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, slug, name, description")
    .order("name");
  return data ?? [];
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
      <p className="mt-1 text-muted-foreground">
        Used to group and filter destinations.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Add a category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryCreateForm />
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {categories.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-medium">{c.name}</p>
                {c.description && (
                  <p className="text-sm text-muted-foreground">
                    {c.description}
                  </p>
                )}
              </div>
              <CategoryDeleteButton categoryId={c.id} />
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No categories yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
