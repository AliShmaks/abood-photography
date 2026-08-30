-- ============================================================
-- Abood Al Husain Photography - Supabase setup
-- Run this entire file in Supabase Dashboard > SQL Editor.
-- Then follow SETUP.md to create the Storage bucket + first admin.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null default 'Untitled',
  image_url text not null,
  storage_path text,
  location text not null default 'Jordan',
  alt_text text,
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists photos_category_id_idx
  on public.photos(category_id);

create index if not exists photos_featured_idx
  on public.photos(featured);

create index if not exists categories_display_order_idx
  on public.categories(display_order);

create index if not exists photos_display_order_idx
  on public.photos(display_order);

alter table public.categories enable row level security;
alter table public.photos enable row level security;
alter table public.admin_users enable row level security;

-- Security-definer helper so policies can verify admin membership
-- without exposing the admin_users table publicly.
create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_current_user_admin() from public;
grant execute on function public.is_current_user_admin() to authenticated;

-- Public website can read active categories.
drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (is_active = true or public.is_current_user_admin());

-- Public website can read portfolio photos.
drop policy if exists "Public can read photos" on public.photos;
create policy "Public can read photos"
on public.photos
for select
to anon, authenticated
using (true);

-- Only admins can create/update/delete categories.
drop policy if exists "Admins insert categories" on public.categories;
create policy "Admins insert categories"
on public.categories
for insert
to authenticated
with check (public.is_current_user_admin());

drop policy if exists "Admins update categories" on public.categories;
create policy "Admins update categories"
on public.categories
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists "Admins delete categories" on public.categories;
create policy "Admins delete categories"
on public.categories
for delete
to authenticated
using (public.is_current_user_admin());

-- Only admins can create/update/delete photo records.
drop policy if exists "Admins insert photos" on public.photos;
create policy "Admins insert photos"
on public.photos
for insert
to authenticated
with check (public.is_current_user_admin());

drop policy if exists "Admins update photos" on public.photos;
create policy "Admins update photos"
on public.photos
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists "Admins delete photos" on public.photos;
create policy "Admins delete photos"
on public.photos
for delete
to authenticated
using (public.is_current_user_admin());

-- No normal client access to the admin_users table itself.
-- Admin checks happen through the security-definer function above.

-- Least-privilege API grants.
grant select on public.categories to anon;
grant select on public.photos to anon;

grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.photos to authenticated;

-- ------------------------------------------------------------
-- STORAGE POLICIES
-- Before these are useful, create a PUBLIC bucket named:
-- portfolio
-- in Supabase Dashboard > Storage.
-- ------------------------------------------------------------

drop policy if exists "Admins upload portfolio images" on storage.objects;
create policy "Admins upload portfolio images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio'
  and public.is_current_user_admin()
);

drop policy if exists "Admins update portfolio images" on storage.objects;
create policy "Admins update portfolio images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio'
  and public.is_current_user_admin()
)
with check (
  bucket_id = 'portfolio'
  and public.is_current_user_admin()
);

drop policy if exists "Admins delete portfolio images" on storage.objects;
create policy "Admins delete portfolio images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio'
  and public.is_current_user_admin()
);

-- Optional starter categories:
insert into public.categories (name, slug, display_order)
values
  ('Weddings', 'weddings', 1),
  ('Engagements', 'engagements', 2),
  ('Portraits', 'portraits', 3),
  ('Events', 'events', 4),
  ('Commercial', 'commercial', 5)
on conflict (slug) do nothing;
