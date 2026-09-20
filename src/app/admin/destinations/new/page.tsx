import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DestinationForm } from "@/components/admin/destination-form";
import { createDestination } from "@/app/admin/destinations/actions";
import { createClient } from "@/lib/supabase/server";

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name").order("name");
  return data ?? [];
}

export default async function NewDestinationPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">New destination</h1>
      <p className="mt-1 text-muted-foreground">
        You can add photos and video after creating it.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DestinationForm
            categories={categories}
            action={createDestination}
            submitLabel="Create destination"
          />
        </CardContent>
      </Card>
    </div>
  );
}
