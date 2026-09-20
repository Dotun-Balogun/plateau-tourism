import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export type DestinationCardData = {
  slug: string;
  name: string;
  summary: string | null;
  region: string | null;
  cover_image_url: string | null;
  avg_rating: number;
  review_count: number;
  category_name?: string | null;
};

export function DestinationCard({ destination }: { destination: DestinationCardData }) {
  return (
    <Link href={`/destinations/${destination.slug}`}>
      <Card className="group overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          {destination.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={destination.cover_image_url}
              alt={destination.name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
              No image yet
            </div>
          )}
          {destination.category_name && (
            <Badge className="absolute top-3 left-3" variant="secondary">
              {destination.category_name}
            </Badge>
          )}
        </div>

        <CardContent className="space-y-2 pb-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{destination.name}</h3>
            {destination.review_count > 0 && (
              <div className="flex shrink-0 items-center gap-1 text-sm">
                <Star className="size-3.5 fill-current text-amber-500" />
                <span>{destination.avg_rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {destination.summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {destination.summary}
            </p>
          )}

          {destination.region && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              <span>{destination.region}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
