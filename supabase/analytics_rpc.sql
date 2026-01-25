-- Modern Analytics Tracking RPC
-- This function allows tracking without exposing table structures to the client.
-- This follows the professional pattern recommended for real-time telemetry.

create or replace function public.track_event(
  p_path text,
  p_session_id text,
  p_metadata jsonb default '{}'::jsonb
) returns void as $$
begin
  insert into public.web_analytics (
    path, 
    session_id, 
    user_agent, 
    language, 
    screen_resolution
  )
  values (
    p_path, 
    p_session_id, 
    (p_metadata->>'user_agent'),
    (p_metadata->>'language'),
    (p_metadata->>'screen_resolution')
  );
end;
$$ language plpgsql security definer;
