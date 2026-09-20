import Link from "next/link";
import { MapPinned } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { NewItineraryDialog } from "@/components/itineraries/new-itinerary-dialog";

type Itinerary = {
  id: string;
  title: string;
  starts_on: string | null;
  ends_on: string | null;
  is_public: boolean;
};

export default async function ItinerariesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <MapPinned className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Plan your trip</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to build a day-by-day itinerary and save your favorite
          destinations.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/auth/login?redirectTo=/itineraries">Sign in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/sign-up">Create an account</Link>
          </Button>
        </div>
      </div>
    );
  }

  let itineraries: Itinerary[] = [];
  try {
    const { data, error } = await supabase
      .from("itineraries")
      .select("id, title, starts_on, ends_on, is_public")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    itineraries = data ?? [];
  } catch {
    itineraries = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your itineraries
          </h1>
          <p className="mt-1 text-muted-foreground">
            Trips you&apos;ve planned across destinations.
          </p>
        </div>
        <NewItineraryDialog />
      </div>

      {itineraries.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {itineraries.map((i) => (
            <Card key={i.id}>
              <CardContent>
                <h3 className="font-semibold">{i.title}</h3>
                {i.starts_on && i.ends_on && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {i.starts_on} – {i.ends_on}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            You haven&apos;t created any itineraries yet. Click &ldquo;New
            itinerary&rdquo; to start planning your trip.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
