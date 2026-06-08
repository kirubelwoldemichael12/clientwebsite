-- Supabase schema for catalog items and uploaded images
-- Run this in the Supabase SQL editor.

-- Enable UUID generation if needed.
create extension if not exists pgcrypto;

-- Main catalog table.
create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  location text not null default 'Ethiopia',
  duration text not null default 'Custom',
  summary text not null default '',
  description text not null default '',
  icon text not null default '✨',
  featured boolean not null default false,
  tags text[] not null default '{}'::text[],
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_items_category_idx on public.catalog_items (category);
create index if not exists catalog_items_featured_idx on public.catalog_items (featured desc);

-- Category hero images.
create table if not exists public.catalog_category_images (
  category text primary key,
  image_url text not null,
  updated_at timestamptz not null default now()
);

-- Package template images.
create table if not exists public.catalog_package_images (
  category text not null,
  package_name text not null,
  image_url text not null,
  updated_at timestamptz not null default now(),
  primary key (category, package_name)
);

-- Keep updated_at fresh on edits.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for all tables.
drop trigger if exists catalog_items_set_updated_at on public.catalog_items;
create trigger catalog_items_set_updated_at
before update on public.catalog_items
for each row execute function public.set_updated_at();

drop trigger if exists catalog_category_images_set_updated_at on public.catalog_category_images;
create trigger catalog_category_images_set_updated_at
before update on public.catalog_category_images
for each row execute function public.set_updated_at();

drop trigger if exists catalog_package_images_set_updated_at on public.catalog_package_images;
create trigger catalog_package_images_set_updated_at
before update on public.catalog_package_images
for each row execute function public.set_updated_at();

-- ── Bookings table ─────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null default '',
  tour_interest text not null default '',
  travel_date text not null default '',
  group_size text not null default '',
  message text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_created_idx on public.bookings (created_at desc);

alter table public.bookings enable row level security;

-- Anyone can submit a booking (public form)
drop policy if exists "Public insert bookings" on public.bookings;
create policy "Public insert bookings"
  on public.bookings for insert
  using (true)
  with check (true);

-- Only authenticated admins can read/update bookings
drop policy if exists "Authenticated read bookings" on public.bookings;
create policy "Authenticated read bookings"
  on public.bookings for select
  to authenticated
  using (true);

drop policy if exists "Authenticated update bookings" on public.bookings;
create policy "Authenticated update bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

-- Optional seed data from the app can be inserted manually or via upsert.

-- Row Level Security.
alter table public.catalog_items enable row level security;
alter table public.catalog_category_images enable row level security;
alter table public.catalog_package_images enable row level security;

-- Public read access for the catalog.
drop policy if exists "Public read catalog items" on public.catalog_items;
create policy "Public read catalog items"
  on public.catalog_items
  for select
  using (true);

drop policy if exists "Public read category images" on public.catalog_category_images;
create policy "Public read category images"
  on public.catalog_category_images
  for select
  using (true);

drop policy if exists "Public read package images" on public.catalog_package_images;
create policy "Public read package images"
  on public.catalog_package_images
  for select
  using (true);

-- Authenticated write access. Adjust to your admin model if you use a custom admin email list.
drop policy if exists "Authenticated write catalog items" on public.catalog_items;
create policy "Authenticated write catalog items"
  on public.catalog_items
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated write category images" on public.catalog_category_images;
create policy "Authenticated write category images"
  on public.catalog_category_images
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated write package images" on public.catalog_package_images;
create policy "Authenticated write package images"
  on public.catalog_package_images
  for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for uploaded images.
insert into storage.buckets (id, name, public)
values ('catalog-images', 'catalog-images', true)
on conflict (id) do update
set public = true;

-- Storage policies.
drop policy if exists "Public read catalog images" on storage.objects;
create policy "Public read catalog images"
  on storage.objects
  for select
  using (bucket_id = 'catalog-images');

drop policy if exists "Authenticated upload catalog images" on storage.objects;
create policy "Authenticated upload catalog images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'catalog-images');

drop policy if exists "Authenticated update catalog images" on storage.objects;
create policy "Authenticated update catalog images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'catalog-images')
  with check (bucket_id = 'catalog-images');

drop policy if exists "Authenticated delete catalog images" on storage.objects;
create policy "Authenticated delete catalog images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'catalog-images');
