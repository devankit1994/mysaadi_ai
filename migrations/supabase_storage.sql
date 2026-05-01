-- Create a new storage bucket for photos
-- Note: You can also do this in the Supabase Dashboard under Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  1048576, -- 1MB limit
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  file_size_limit = 1048576,
  allowed_mime_types = array['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Set up Row Level Security (RLS) for the photos bucket
-- This assumes you have enabled RLS on storage.objects, which is true by default in new projects

-- Drop existing policies if they exist to make the script idempotent
drop policy if exists "Authenticated users can upload photos" on storage.objects;
drop policy if exists "Public access to photos" on storage.objects;
drop policy if exists "Users can update own photos" on storage.objects;
drop policy if exists "Users can delete own photos" on storage.objects;

-- Allow authenticated users to upload files to the 'photos' bucket
-- They can only upload if they are the owner (which Supabase handles automatically for authenticated requests)
create policy "Authenticated users can upload photos"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'photos' and auth.uid() = owner );

-- Allow public access to view photos
create policy "Public access to photos"
on storage.objects for select
to public
using ( bucket_id = 'photos' );

-- Allow users to update/delete their own photos
create policy "Users can update own photos"
on storage.objects for update
to authenticated
using ( bucket_id = 'photos' and auth.uid() = owner );

create policy "Users can delete own photos"
on storage.objects for delete
to authenticated
using ( bucket_id = 'photos' and auth.uid() = owner );
