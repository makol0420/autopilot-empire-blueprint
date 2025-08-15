-- Ensure a public storage bucket named "videos" exists
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Enforce public access on the bucket (idempotent)
update storage.buckets set public = true where id = 'videos';

-- Public read access for all objects in the "videos" bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read access for videos'
  ) then
    create policy "Public read access for videos"
      on storage.objects
      for select
      using ( bucket_id = 'videos' );
  end if;
end
$$;

-- Allow authenticated users to upload into the "videos" bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload videos'
  ) then
    create policy "Authenticated users can upload videos"
      on storage.objects
      for insert to authenticated
      with check (
        bucket_id = 'videos' and auth.uid() = owner
      );
  end if;
end
$$;

-- Allow authenticated users to update their own objects in the "videos" bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can update own videos'
  ) then
    create policy "Authenticated users can update own videos"
      on storage.objects
      for update to authenticated
      using (
        bucket_id = 'videos' and auth.uid() = owner
      );
  end if;
end
$$;

-- Allow authenticated users to delete their own objects in the "videos" bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can delete own videos'
  ) then
    create policy "Authenticated users can delete own videos"
      on storage.objects
      for delete to authenticated
      using (
        bucket_id = 'videos' and auth.uid() = owner
      );
  end if;
end
$$;