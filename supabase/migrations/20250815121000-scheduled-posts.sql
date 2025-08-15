-- Create scheduled posts table
create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  video_url text not null,
  caption text not null,
  platforms text[] not null,
  scheduled_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','processing','completed','partial','failed','cancelled')),
  results jsonb,
  last_error text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.scheduled_posts enable row level security;

-- Policies
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'scheduled_posts' and policyname = 'Users can view their own scheduled posts'
  ) then
    create policy "Users can view their own scheduled posts"
      on public.scheduled_posts
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'scheduled_posts' and policyname = 'Users can insert their own scheduled posts'
  ) then
    create policy "Users can insert their own scheduled posts"
      on public.scheduled_posts
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'scheduled_posts' and policyname = 'Users can update their own scheduled posts'
  ) then
    create policy "Users can update their own scheduled posts"
      on public.scheduled_posts
      for update using (auth.uid() = user_id);
  end if;
end$$;

-- Trigger function to update updated_at
create or replace function public.update_scheduled_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger
create trigger trg_update_scheduled_posts_updated_at
before update on public.scheduled_posts
for each row execute function public.update_scheduled_posts_updated_at();

-- Helpful indexes
create index if not exists idx_scheduled_posts_user_time_status
  on public.scheduled_posts (user_id, scheduled_at, status);
create index if not exists idx_scheduled_posts_status_time
  on public.scheduled_posts (status, scheduled_at);