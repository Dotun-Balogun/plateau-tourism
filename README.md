# Discover Plateau State — Integrated Tourism Multimedia System

A destination discovery platform: browse tourism destinations, view photo/video
galleries, read and leave reviews, build multi-day itineraries, and manage
everything through a role-gated admin area.

**Stack:** Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 ·
shadcn/ui · Supabase (Postgres, Auth, Storage, RLS) · TanStack Query ·
React Hook Form + Zod

---

## 1. What's working right now

- Public site: homepage, `/destinations` (with category filters), destination
  detail pages with photo/video gallery and reviews, `/categories`, `/about`,
  `/contact`, `/privacy`, `/terms`
- Auth: sign up, sign in, sign out, email confirmation callback — session
  handled via cookies, refreshed on every request by `src/proxy.ts`
- `/itineraries` — signed-in users can create itineraries (dialog is wired to
  a real Server Action, not a placeholder)
- **Admin area** at `/admin`, gated to `editor`/`admin` roles:
  - `/admin` — overview counts
  - `/admin/destinations` — list, publish/unpublish toggle, delete
  - `/admin/destinations/new` and `/admin/destinations/[id]` — create/edit
    destinations, **upload photos and videos** directly to Supabase Storage
    and attach them to the destination
  - `/admin/categories` — create/delete categories

---

## 2. A note on "latest"

Every dependency was checked against the npm registry at scaffold time
(**September 2026**), not from memory. Two exceptions were made on purpose,
because "latest" broke the toolchain rather than improving it:

| Package | Latest available | What's installed | Why |
|---|---|---|---|
| `typescript` | 7.0.2 | **5.9.3** | TypeScript 7's new native compiler ships no importable compiler API yet, which breaks `typescript-eslint`'s type-aware rules entirely. |
| `eslint` | 10.10.0 | **9.39.5** | ESLint 10's rule-context API change (`context.getFilename` → `context.filename`) crashes `eslint-plugin-react`, pulled in by `eslint-config-next`. |

Run `pnpm outdated` periodically; bump both once upstream catches up.

---

## 3. Prerequisites

- **Node.js ≥ 20.9**
- **pnpm** — `npm install -g pnpm` if you don't have it
- A **Supabase** project (hosted, or run locally with Docker)

---

## 4. First-time setup

```bash
cd tourism-platform
pnpm install
cp .env.example .env.local
```

Fill in `.env.local` from your Supabase project's **Settings → API Keys**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Older Supabase projects call these "anon" / "service_role" instead of
> "publishable" / "secret" — either naming works, just paste whichever your
> project's API page shows.

**Push the schema and seed data:**

```bash
pnpm dlx supabase login
pnpm dlx supabase link --project-ref your-project-ref
pnpm db:push
pnpm dlx supabase db query --file supabase/seed.sql --linked
```

(Local Docker alternative: `pnpm db:start && pnpm db:reset`.)

**Turn off email confirmation while you're testing** (Dashboard →
Authentication → Providers → Email → toggle off "Confirm email"). Supabase's
built-in email sending is heavily rate-limited and often doesn't arrive at
all — this isn't an app bug. Before real launch, turn confirmation back on
and connect a real SMTP provider (Resend, Postmark, SendGrid) under
Authentication → Emails. Also check **Authentication → URL Configuration**
and make sure your real deployed URL is listed, not just `localhost:3000`.

Run it:

```bash
pnpm dev
```

---

## 5. Getting into the admin area

Every new sign-up gets the `tourist` role by default — that's intentional
(RLS locks writes to `editor`/`admin`). To make yourself an admin, run this
in the Supabase Dashboard **SQL Editor** after signing up once through the
app:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

Sign out and back in, and you'll see an **Admin** link in the header.

### Uploading photos and video

On any destination's edit page (`/admin/destinations/[id]`), the "Photos &
video" card lets you pick multiple image/video files at once. Each file is:

1. Uploaded directly to the `destination-media` Supabase Storage bucket
   (public bucket, 50MB/file limit — matches `supabase/config.toml`)
2. Recorded as a row in `media_assets`, linked to that destination
3. The first uploaded image automatically becomes the destination's cover
   photo if one isn't set yet

Accepted types: any `image/*` or `video/*` MIME type (so JPG, PNG, WEBP,
MP4, MOV, etc. all work). Deleting a media item removes both the storage
object and the database row.

---

## 6. What's in the box

```
src/
  app/
    admin/                     Role-gated admin area
      layout.tsx                 Redirects non-staff away
      page.tsx                    Overview / counts
      destinations/
        page.tsx                  List + publish toggle + delete
        actions.ts                 Server Actions: create/update/delete/publish, media attach/delete
        new/page.tsx                Create form
        [id]/page.tsx                Edit form + media manager
      categories/
        page.tsx                  List + create form
        actions.ts                 Server Actions: create/delete
    auth/
      login/, sign-up/            Forms wired to Supabase auth
      callback/route.ts            Email confirmation / OAuth redirect handler
      error/page.tsx                Fallback error page
      actions.ts                    signOut Server Action
    destinations/
      page.tsx                    Public listing with category filter
      [slug]/page.tsx               Public detail: gallery, rating, reviews
    itineraries/
      page.tsx                    Auth-gated itinerary list
      actions.ts                    createItinerary Server Action
    categories/page.tsx           Public category grid
    about/, contact/, privacy/, terms/    Static pages
    layout.tsx                    Root layout: fonts, header/footer, providers
    page.tsx                       Homepage
    globals.css                    Tailwind v4 + shadcn tokens (warm orange/teal theme)
  components/
    ui/                          shadcn/ui primitives
    layout/                       SiteHeader (auth-aware), SiteFooter
    auth/                          LoginForm, SignUpForm, UserMenu
    admin/                         DestinationForm, MediaManager, category components
    destinations/                  DestinationCard
    itineraries/                   NewItineraryDialog
    providers/                     QueryProvider (TanStack Query)
  lib/
    supabase/
      client.ts                   Browser client
      server.ts                    Server Component / Server Action client
      admin.ts                     Secret-key client (bypasses RLS, server-only)
      middleware.ts                 Session refresh — uses getUser(), not getClaims()
      current-user.ts                Helper: current user + profile + role
    utils.ts                       cn() helper
  types/database.types.ts          Hand-written to match the migration
  proxy.ts                         Next.js 16 middleware (renamed from middleware.ts)
supabase/
  config.toml                      Local dev config
  migrations/0001_init.sql          Full schema, RLS, triggers, storage bucket
  seed.sql                          Plateau State sample destinations
```

### Data model

- **profiles** — extends `auth.users`; `role` is `tourist` / `editor` / `admin`
- **categories**, **destinations**, **media_assets**, **reviews** (rating
  rollup trigger keeps `avg_rating`/`review_count` in sync), **itineraries** +
  **itinerary_items**, **favorites**
- RLS on every table: public reads published destinations/categories/reviews;
  only `editor`/`admin` write destinations/media/categories; users manage
  only their own reviews/itineraries/favorites

---

## 7. Two bugs fixed since the first scaffold

1. **Sign-in "lockout" bug** — `src/lib/supabase/middleware.ts` previously
   called `supabase.auth.getClaims()`, which only works on projects with
   asymmetric JWT signing keys enabled. Most projects don't have that on by
   default, so it threw on every request and broke sessions. Now uses
   `getUser()`, which works everywhere.
2. **"New itinerary" did nothing** — it's now a real dialog backed by a
   Server Action that inserts into `itineraries` and refreshes the list.

---

## 8. Everyday scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm db:push` | Push local migrations to your linked hosted project |
| `pnpm db:types` | Regenerate `src/types/database.types.ts` from the live schema |
| `pnpm dlx supabase db query --file supabase/seed.sql --linked` | Load/reload sample data on a hosted project |

---

## 9. Suggested next steps

1. Give itineraries an item-builder UI (add/remove destinations per day) —
   the `itinerary_items` table and RLS policies already support it.
2. Wire the `/contact` form to a Server Action (insert into a `messages`
   table, or send an email via Resend).
3. Add a Mapbox-powered map to destination pages
   (`NEXT_PUBLIC_MAPBOX_TOKEN` is already templated in `.env.example`).
4. If you want non-admins to submit reviews from the UI (not just via SQL),
   add a review form to the destination detail page — RLS already allows
   authenticated users to write their own.

---

## 10. Deployment

**Vercel** (zero-config for Next.js) + your hosted **Supabase** project is
the simplest pairing. Set the three env vars from §4 in your Vercel project
settings, then push `main`. Don't forget the admin role SQL from §5 and the
email-confirmation settings — those live in Supabase, not in this repo.
