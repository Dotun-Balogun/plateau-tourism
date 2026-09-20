import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Get in touch</h1>
      <p className="mt-2 text-muted-foreground">
        Questions, suggestions, or a destination we should add? Send us a
        message.
      </p>

      <Card className="mt-8">
        <CardContent>
          {/*
            UI only for now — wire this up to a Server Action that inserts
            into a `messages` table (or sends an email) once you're ready.
          */}
          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="border-input dark:bg-input/30 flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                placeholder="How can we help?"
              />
            </div>
            <Button type="submit" className="w-full">
              Send message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
