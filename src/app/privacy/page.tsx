export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Placeholder policy — replace with your actual terms before launch.
      </p>

      <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-semibold text-foreground">Information we collect</h2>
          <p className="mt-2">
            When you create an account, we store your name, email address,
            and any profile information you provide. When you write a review
            or build an itinerary, that content is stored against your
            account.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground">How we use it</h2>
          <p className="mt-2">
            Your information is used to operate the platform: displaying
            your reviews, saving your itineraries, and authenticating your
            account. We do not sell personal data to third parties.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-foreground">Your choices</h2>
          <p className="mt-2">
            You can update or delete your profile information, reviews, and
            itineraries at any time from your account.
          </p>
        </section>
      </div>
    </div>
  );
}
