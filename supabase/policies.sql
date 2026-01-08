-- Supabase schema and RLS policies for ModLift
-- Run in the SQL editor or supabase CLI. Adjust types as needed.

-- Vehicles reference data
create table if not exists public.vehicles (
  id bigint generated always as identity primary key,
  year int not null,
  make text not null,
  model text not null,
  submodel text,
  drivetrain text
);

-- Images for gallery previews
create table if not exists public.images (
  id bigint generated always as identity primary key,
  url text not null,
  make text,
  model text,
  description text,
  created_at timestamp with time zone default now()
);

-- Wheels and tires (optional datasets)
create table if not exists public.wheels (
  id bigint generated always as identity primary key,
  brand text,
  model text,
  diameter numeric,
  width numeric,
  bolt_pattern text,
  offset numeric
);

create table if not exists public.tires (
  id bigint generated always as identity primary key,
  brand text,
  model text,
  size text
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null,
  price numeric,
  description text,
  fitment text,
  image_url text,
  badge text,
  slug text unique,
  priority int default 999,
  created_at timestamptz default now()
);

create table if not exists public.builds (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  year int,
  make text,
  model text,
  trim text,
  step text,
  build_name text,
  vehicle jsonb,
  selected_parts jsonb,
  image_id bigint references public.images(id),
  vehicle_id bigint references public.vehicles(id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text default 'processing',
  total_price numeric(10,2),
  submitted_at timestamptz,
  email text,
  order_notes text,
  items jsonb,
  shipping_info jsonb,
  shipping_address jsonb,
  build_summary jsonb
);

-- Enable Row Level Security
alter table public.vehicles enable row level security;
alter table public.images enable row level security;
alter table public.builds enable row level security;
alter table public.orders enable row level security;
alter table public.wheels enable row level security;
alter table public.tires enable row level security;
alter table public.products enable row level security;
alter table public.orders add column if not exists items jsonb;
alter table public.orders add column if not exists shipping_info jsonb;

-- Policies (anon-friendly for prototyping; tighten before prod)
do $$ begin
  -- Vehicles readable by anyone
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='vehicles' and p.policyname='Vehicles select anon'
  ) then
    create policy "Vehicles select anon" on public.vehicles
      for select using ( true );
  end if;

  -- Images readable by anyone
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='images' and p.policyname='Images select anon'
  ) then
    create policy "Images select anon" on public.images
      for select using ( true );
  end if;

  -- Wheels readable by anyone
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='wheels' and p.policyname='Wheels select anon'
  ) then
    create policy "Wheels select anon" on public.wheels
      for select using ( true );
  end if;

  -- Tires readable by anyone
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='tires' and p.policyname='Tires select anon'
  ) then
    create policy "Tires select anon" on public.tires
      for select using ( true );
  end if;

  -- Products readable by anyone
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='products' and p.policyname='Products select anon'
  ) then
    create policy "Products select anon" on public.products
      for select using ( true );
  end if;

  -- Builds insert for authenticated user only
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='builds' and p.policyname='Builds insert user-only'
  ) then
    create policy "Builds insert user-only" on public.builds
      for insert with check (auth.uid() = user_id);
  end if;

  -- Builds readable by owner only
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='builds' and p.policyname='Builds select user-only'
  ) then
    create policy "Builds select user-only" on public.builds
      for select using (auth.uid() = user_id);
  end if;

  -- Builds update by owner only
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='builds' and p.policyname='Builds update user-only'
  ) then
    create policy "Builds update user-only" on public.builds
      for update using (auth.uid() = user_id);
  end if;

  -- Builds delete by owner only
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='builds' and p.policyname='Builds delete user-only'
  ) then
    create policy "Builds delete user-only" on public.builds
      for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Orders RLS
do $$ begin
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='orders' and p.policyname='Orders select user-only'
  ) then
    create policy "Orders select user-only" on public.orders
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='orders' and p.policyname='Orders insert user-only'
  ) then
    create policy "Orders insert user-only" on public.orders
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='orders' and p.policyname='Orders update user-only'
  ) then
    create policy "Orders update user-only" on public.orders
      for update using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='orders' and p.policyname='Orders delete user-only'
  ) then
    create policy "Orders delete user-only" on public.orders
      for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Helpful indexes
create index if not exists vehicles_year_make_model_idx on public.vehicles(year, make, model);
create index if not exists images_make_model_idx on public.images(make, model);
create index if not exists wheels_brand_model_idx on public.wheels(brand, model);
create index if not exists products_category_idx on public.products(category);
