-- =========================================================================
-- Integrated Tourism Multimedia System — initial schema
-- =========================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- Enums
-- -------------------------------------------------------------------------
create type public.app_role as enum ('tourist', 'editor', 'admin');
create type public.media_kind as enum ('image', 'video', 'audio', 'panorama_360');

-- -------------------------------------------------------------------------
-- profiles — extends auth.users with app-facing data
-- -------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.app_role not null default 'tourist',
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- categories — e.g. Beaches, Mountains, Heritage, Food & Drink
-- -------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- destinations — the core tourism entity
-- -------------------------------------------------------------------------
create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text,
  description text,
  category_id uuid references public.categories (id) on delete set null,
  region text,
  country text not null default 'Nigeria',
  latitude double precision,
  longitude double precision,
  cover_image_url text,
  avg_rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index destinations_category_id_idx on public.destinations (category_id);
create index destinations_is_published_idx on public.destinations (is_published);
create index destinations_location_idx on public.destinations (latitude, longitude);

-- -------------------------------------------------------------------------
-- media_assets — photos/videos/audio/360s attached to a destination
-- -------------------------------------------------------------------------
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations (id) on delete cascade,
  kind public.media_kind not null default 'image',
  storage_path text not null,
  caption text,
  position integer not null default 0,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index media_assets_destination_id_idx on public.media_assets (destination_id);

-- -------------------------------------------------------------------------
-- reviews — one per (user, destination)
-- -------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  unique (destination_id, user_id)
);

create index reviews_destination_id_idx on public.reviews (destination_id);

-- -------------------------------------------------------------------------
-- itineraries + itinerary_items — user-built trip plans
-- -------------------------------------------------------------------------
create table public.itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  starts_on date,
  ends_on date,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.itineraries (id) on delete cascade,
  destination_id uuid not null references public.destinations (id) on delete cascade,
  day_number integer not null default 1,
  position integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create index itinerary_items_itinerary_id_idx on public.itinerary_items (itinerary_id);

-- -------------------------------------------------------------------------
-- favorites — simple bookmarking
-- -------------------------------------------------------------------------
create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  destination_id uuid not null references public.destinations (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, destination_id)
);

-- =========================================================================
-- Rating rollup trigger
-- =========================================================================
create function public.recalculate_destination_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.destinations d
  set
    avg_rating = coalesce((
      select round(avg(r.rating)::numeric, 1)
      from public.reviews r
      where r.destination_id = coalesce(new.destination_id, old.destination_id)
    ), 0),
    review_count = (
      select count(*)
      from public.reviews r
      where r.destination_id = coalesce(new.destination_id, old.destination_id)
    )
  where d.id = coalesce(new.destination_id, old.destination_id);
  return coalesce(new, old);
end;
$$;

create trigger reviews_after_change
after insert or update or delete on public.reviews
for each row execute function public.recalculate_destination_rating();

-- =========================================================================
-- updated_at trigger helper
-- =========================================================================
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger destinations_set_updated_at before update on public.destinations
for each row execute function public.set_updated_at();

create trigger itineraries_set_updated_at before update on public.itineraries
for each row execute function public.set_updated_at();

-- =========================================================================
-- New user → profile row
-- =========================================================================
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.destinations enable row level security;
alter table public.media_assets enable row level security;
alter table public.reviews enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.favorites enable row level security;

-- helper: is the current user an editor or admin?
create function public.is_staff()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('editor', 'admin')
  );
$$;

-- profiles
create policy "profiles are viewable by everyone" on public.profiles
  for select using (true);
create policy "users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- categories
create policy "categories are viewable by everyone" on public.categories
  for select using (true);
create policy "staff can manage categories" on public.categories
  for all using (public.is_staff()) with check (public.is_staff());

-- destinations
create policy "published destinations are viewable by everyone" on public.destinations
  for select using (is_published or public.is_staff());
create policy "staff can manage destinations" on public.destinations
  for all using (public.is_staff()) with check (public.is_staff());

-- media_assets
create policy "media is viewable when destination is viewable" on public.media_assets
  for select using (
    exists (
      select 1 from public.destinations d
      where d.id = destination_id and (d.is_published or public.is_staff())
    )
  );
create policy "staff can manage media" on public.media_assets
  for all using (public.is_staff()) with check (public.is_staff());

-- reviews
create policy "reviews are viewable by everyone" on public.reviews
  for select using (true);
create policy "authenticated users can write their own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "users can update their own reviews" on public.reviews
  for update using (auth.uid() = user_id);
create policy "users or staff can delete reviews" on public.reviews
  for delete using (auth.uid() = user_id or public.is_staff());

-- itineraries
create policy "users can view their own itineraries" on public.itineraries
  for select using (auth.uid() = user_id or is_public);
create policy "users manage their own itineraries" on public.itineraries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- itinerary_items
create policy "users can view items on visible itineraries" on public.itinerary_items
  for select using (
    exists (
      select 1 from public.itineraries i
      where i.id = itinerary_id and (i.user_id = auth.uid() or i.is_public)
    )
  );
create policy "users manage items on their own itineraries" on public.itinerary_items
  for all using (
    exists (
      select 1 from public.itineraries i
      where i.id = itinerary_id and i.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.itineraries i
      where i.id = itinerary_id and i.user_id = auth.uid()
    )
  );

-- favorites
create policy "users manage their own favorites" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- Storage buckets
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('destination-media', 'destination-media', true)
on conflict (id) do nothing;

create policy "destination media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'destination-media');

create policy "staff can upload destination media"
  on storage.objects for insert
  with check (bucket_id = 'destination-media' and public.is_staff());

create policy "staff can update destination media"
  on storage.objects for update
  using (bucket_id = 'destination-media' and public.is_staff());

create policy "staff can delete destination media"
  on storage.objects for delete
  using (bucket_id = 'destination-media' and public.is_staff());
