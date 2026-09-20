export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Placeholder terms — replace with your actual terms before launch.
      </p>

      <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-semibold text-foreground">Using this platform</h2>
          <p className="mt-2">
            This platform is provided to help travelers discover destinations
            and plan trips. You agree to use it lawfully and not to submit
            false, misleading, or abusive content in reviews or itineraries.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground">Content you submit</h2>
          <p className="mt-2">
            You retain ownership of reviews and itineraries you create, but
            grant us permission to display them on the platform.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground">Changes</h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of the
            platform after changes constitutes acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  );
}
