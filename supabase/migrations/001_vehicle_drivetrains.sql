-- Vehicle Drivetrains Table
-- This table stores which drivetrains are available for specific vehicle configurations
-- Allows filtering drivetrain options based on year/make/model/trim selection

-- Create the vehicle_drivetrains table
create table if not exists public.vehicle_drivetrains (
  id bigint generated always as identity primary key,
  year_start int not null,                    -- Start year for this configuration
  year_end int not null,                      -- End year (allows ranges like 2019-2024)
  make text not null,                         -- e.g., 'RAM', 'Chevrolet', 'Ford'
  model text not null,                        -- e.g., '1500', 'Silverado 1500', 'F-150'
  trim text,                                  -- Optional: specific trim, null = all trims
  drivetrain text not null,                   -- e.g., '4WD', 'RWD', 'AWD', 'FWD'
  drivetrain_label text not null,             -- Display label: '4WD (4x4)', 'RWD (Rear Wheel)'
  is_default boolean default false,           -- Mark if this is the most common option
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Ensure no duplicate entries
  constraint unique_vehicle_drivetrain unique (year_start, year_end, make, model, trim, drivetrain)
);

-- Create indexes for fast lookups
create index if not exists idx_vehicle_drivetrains_lookup
  on public.vehicle_drivetrains(make, model, year_start, year_end);

create index if not exists idx_vehicle_drivetrains_trim
  on public.vehicle_drivetrains(make, model, trim);

-- Enable RLS
alter table public.vehicle_drivetrains enable row level security;

-- Allow anyone to read (reference data)
create policy "Vehicle drivetrains select anon" on public.vehicle_drivetrains
  for select using (true);

-- Only authenticated users with admin role can modify (future admin feature)
-- For now, allow service role to insert/update via seed scripts

-- Function to get available drivetrains for a vehicle
create or replace function public.get_vehicle_drivetrains(
  p_year int,
  p_make text,
  p_model text,
  p_trim text default null
)
returns table (
  drivetrain text,
  drivetrain_label text,
  is_default boolean
)
language plpgsql
security definer
as $$
begin
  return query
  select distinct
    vd.drivetrain,
    vd.drivetrain_label,
    vd.is_default
  from public.vehicle_drivetrains vd
  where
    lower(vd.make) = lower(p_make)
    and lower(vd.model) = lower(p_model)
    and p_year between vd.year_start and vd.year_end
    and (
      vd.trim is null
      or p_trim is null
      or lower(vd.trim) = lower(p_trim)
    )
  order by vd.is_default desc, vd.drivetrain;
end;
$$;

-- Grant execute permission
grant execute on function public.get_vehicle_drivetrains(int, text, text, text) to anon, authenticated;
