-- Fix the posts_status_check constraint to ensure it includes 'pending_review'
-- This script safely drops the old constraint and creates a new one with correct values.

do $$ 
begin
    -- 1. Try to find and drop the existing constraint
    alter table public.posts drop constraint if exists posts_status_check;
    
    -- 2. Add the correct constraint
    alter table public.posts add constraint posts_status_check 
    check (status in ('draft', 'pending_review', 'scheduled', 'published', 'archived'));
    
    -- 3. Update any existing posts that might be stuck in a weird state (optional but safe)
    update public.posts set status = 'draft' where status is null;
end $$;
