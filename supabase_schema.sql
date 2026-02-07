-- Create a table for public profiles if it doesn't exist
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  phone text unique,
  first_name text,
  last_name text,
  date_of_birth date,
  gender text,
  is_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add new columns if they don't exist (idempotent)
alter table profiles add column if not exists city text;
alter table profiles add column if not exists state text;
alter table profiles add column if not exists looking_for text;
alter table profiles add column if not exists age_range_min integer;
alter table profiles add column if not exists age_range_max integer;
alter table profiles add column if not exists preferred_religion text;
alter table profiles add column if not exists preferred_city text;
alter table profiles add column if not exists photos text[];
alter table profiles add column if not exists education text;
alter table profiles add column if not exists profession text;
alter table profiles add column if not exists income text;
alter table profiles add column if not exists family_type text;
alter table profiles add column if not exists diet text;
alter table profiles add column if not exists drinking text;
alter table profiles add column if not exists smoking text;
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists interests text[];

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Drop existing policies to avoid errors on re-run
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a trigger to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop trigger if exists to avoid error
drop trigger if exists profiles_updated_at on profiles;

create trigger profiles_updated_at
before update on profiles
for each row execute procedure handle_updated_at();
