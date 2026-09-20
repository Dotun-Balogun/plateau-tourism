import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Authentication error" };

export default function AuthErrorPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardContent className="space-y-4 py-10 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t complete that sign-in. The link may have expired
            — try signing in again.
          </p>
          <Button asChild>
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
