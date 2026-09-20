-- Sample data for local development. Safe to re-run.
-- Case study: Plateau State, Nigeria

insert into public.categories (slug, name, description, icon) values
  ('rock-formations', 'Rock Formations', 'Iconic granite outcrops and rock art', 'Mountain'),
  ('waterfalls', 'Waterfalls & Nature', 'Falls, reserves, and highland scenery', 'Waves'),
  ('heritage', 'Heritage & Culture', 'Museums, monuments, and history', 'Landmark'),
  ('parks', 'Parks & Wildlife', 'Game reserves and recreational parks', 'Trees')
on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, summary, description, category_id, region, country, latitude, longitude, cover_image_url, is_published)
select
  'shere-hills', 'Shere Hills',
  'A dramatic hill range overlooking Jos, popular for hiking and paragliding.',
  'Shere Hills is one of the highest points in Plateau State, offering panoramic views over Jos and a popular launch site for paragliding, alongside hiking trails through its rocky terrain.',
  c.id, 'Jos North LGA', 'Nigeria', 9.9500, 8.9333,
  null, true
from public.categories c where c.slug = 'rock-formations'
on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, summary, description, category_id, region, country, latitude, longitude, cover_image_url, is_published)
select
  'assop-falls', 'Assop Falls',
  'A scenic multi-tiered waterfall along the Jos-Abuja road.',
  'Assop Falls cascades down a rocky escarpment in a series of terraces, making it one of the most photographed natural landmarks in Plateau State.',
  c.id, 'Jos South LGA', 'Nigeria', 9.6167, 8.9333,
  null, true
from public.categories c where c.slug = 'waterfalls'
on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, summary, description, category_id, region, country, latitude, longitude, cover_image_url, is_published)
select
  'riyom-rock', 'Riyom Rock',
  'A cluster of balanced granite boulders, a natural geological wonder.',
  'Riyom Rock consists of towering, precariously balanced granite formations shaped over millions of years, and is one of Plateau State''s most recognizable natural landmarks.',
  c.id, 'Riyom LGA', 'Nigeria', 9.7167, 8.7000,
  null, true
from public.categories c where c.slug = 'rock-formations'
on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, summary, description, category_id, region, country, latitude, longitude, cover_image_url, is_published)
select
  'jos-museum', 'Jos Museum & National Pottery Centre',
  'Nigeria''s premier archaeology and ethnography museum.',
  'Home to the Nok terracotta collection and a wide range of Nigerian art, pottery, and archaeological artifacts, the Jos Museum is a cornerstone of Plateau State''s cultural heritage tourism.',
  c.id, 'Jos North LGA', 'Nigeria', 9.9167, 8.8833,
  null, true
from public.categories c where c.slug = 'heritage'
on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, summary, description, category_id, region, country, latitude, longitude, cover_image_url, is_published)
select
  'wildlife-park-jos', 'Jos Wildlife Park',
  'A zoological park and recreational green space in the heart of Jos.',
  'Jos Wildlife Park houses a variety of indigenous animal species and doubles as a popular recreational spot for residents and visitors alike.',
  c.id, 'Jos North LGA', 'Nigeria', 9.8965, 8.8583,
  null, true
from public.categories c where c.slug = 'parks'
on conflict (slug) do nothing;
