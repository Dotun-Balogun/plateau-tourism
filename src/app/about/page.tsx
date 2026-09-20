import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">About this project</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        This platform is an Integrated Tourism Multimedia System built as a
        case study for Plateau State, Nigeria. It brings together destination
        information, photo and video galleries, visitor reviews, and
        itinerary planning into a single, easy-to-navigate experience for
        travelers.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Plateau State is home to some of Nigeria&apos;s most distinctive
        natural landmarks — from the granite formations of Riyom Rock and
        Shere Hills to the terraced cascades of Assop Falls — alongside deep
        cultural heritage represented at sites like the Jos Museum.
      </p>

      <Card className="mt-8">
        <CardContent>
          <h2 className="font-semibold">Built with</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase
            (Postgres, Auth, Storage, Row Level Security).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
