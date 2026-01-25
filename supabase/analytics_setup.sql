-- Web Analytics Tracking Table
-- This table logs visitor page views and basic metadata for custom dashboarding.

create table if not exists public.web_analytics (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  path text not null,
  referrer text,
  session_id text,
  user_agent text,
  language text,
  screen_resolution text,
  ip_hash text -- Optional: For unique visitor counting without storing actual IPs
);

-- Enable RLS
alter table public.web_analytics enable row level security;

-- Drop existing policy if it exists (for re-runnability)
drop policy if exists "Allow public insert for analytics" on public.web_analytics;

-- Policy to allow anonymous tracking events
create policy "Allow public insert for analytics"
on public.web_analytics
for insert
to anon
with check (true);

-- Indexes for performance
create index if not exists idx_analytics_path on public.web_analytics(path);
create index if not exists idx_analytics_created on public.web_analytics(created_at);
create index if not exists idx_analytics_session on public.web_analytics(session_id);
