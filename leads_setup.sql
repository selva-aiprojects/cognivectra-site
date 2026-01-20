-- Ensure contacts table exists with correct schema
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  email text,
  message text,
  stage text,
  need text
);

-- Enable RLS for contacts
alter table public.contacts enable row level security;

-- Policy for Public Inserts
drop policy if exists "Anyone can submit contact form" on public.contacts;
create policy "Anyone can submit contact form"
  on public.contacts for insert
  with check (true);

-- Policy for Admin Select
drop policy if exists "Admins can view all contacts" on public.contacts;
create policy "Admins can view all contacts"
  on public.contacts for select
  using ( auth.role() = 'authenticated' );

-- Ensure chat_conversations also has Admin Read Policy (already in chat_setup.sql but reinforcing)
drop policy if exists "Admins can view all chats" on public.chat_conversations;
create policy "Admins can view all chats"
  on public.chat_conversations for select
  using ( auth.role() = 'authenticated' );
