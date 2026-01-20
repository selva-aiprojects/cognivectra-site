-- Create social_media_posts table to track publishing status
create table if not exists public.social_media_posts (
  id uuid default gen_random_uuid() primary key,
  post_id bigint references public.posts(id) on delete cascade,
  platform text not null, -- 'linkedin', 'instagram', 'facebook'
  platform_post_id text,
  platform_url text,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.social_media_posts enable row level security;

-- Policies
create policy "Anyone can view social posts"
  on public.social_media_posts for select
  using ( true );

create policy "Admins can manage social posts"
  on public.social_media_posts for all
  using ( auth.role() = 'authenticated' );
