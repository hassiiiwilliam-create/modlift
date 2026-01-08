-- Create user_vehicles table for storing user's saved vehicles (garage)
-- This is separate from the vehicles reference data table

create table if not exists public.user_vehicles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  year int not null,
  make text not null,
  model text not null,
  trim text,
  nickname text
);

-- Enable Row Level Security
alter table public.user_vehicles enable row level security;

-- RLS Policies for user_vehicles
do $$ begin
  -- Users can only see their own vehicles
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='user_vehicles' and p.policyname='User vehicles select user-only'
  ) then
    create policy "User vehicles select user-only" on public.user_vehicles
      for select using (auth.uid() = user_id);
  end if;

  -- Users can only insert their own vehicles
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='user_vehicles' and p.policyname='User vehicles insert user-only'
  ) then
    create policy "User vehicles insert user-only" on public.user_vehicles
      for insert with check (auth.uid() = user_id);
  end if;

  -- Users can only update their own vehicles
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='user_vehicles' and p.policyname='User vehicles update user-only'
  ) then
    create policy "User vehicles update user-only" on public.user_vehicles
      for update using (auth.uid() = user_id);
  end if;

  -- Users can only delete their own vehicles
  if not exists (
    select 1 from pg_policies p where p.schemaname='public' and p.tablename='user_vehicles' and p.policyname='User vehicles delete user-only'
  ) then
    create policy "User vehicles delete user-only" on public.user_vehicles
      for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Index for faster user lookups
create index if not exists user_vehicles_user_id_idx on public.user_vehicles(user_id);
