-- Add missing columns to 'posts' table if they don't exist
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name='posts' and column_name='social_media_data') then
        alter table public.posts add column social_media_data jsonb default '{}'::jsonb;
    end if;

    if not exists (select 1 from information_schema.columns where table_name='posts' and column_name='published_platforms') then
        alter table public.posts add column published_platforms text[] default '{}'::text[];
    end if;

    if not exists (select 1 from information_schema.columns where table_name='posts' and column_name='tags') then
        alter table public.posts add column tags text[] default '{}'::text[];
    end if;

    if not exists (select 1 from information_schema.columns where table_name='posts' and column_name='review_requested_at') then
        alter table public.posts add column review_requested_at timestamp with time zone;
    end if;
end $$;
