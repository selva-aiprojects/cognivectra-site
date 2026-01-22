-- Create the chat_conversations table
create table public.chat_conversations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_name text,
  user_email text,
  company text,
  stage text,
  challenge text,
  budget text,
  timeline text,
  messages jsonb default '[]'::jsonb,
  status text default 'new'
);

-- Enable RLS
alter table public.chat_conversations enable row level security;

-- Allow anonymous inserts (for website visitors)
create policy "Anyone can start a chat"
  on public.chat_conversations for insert
  with check (true);

-- Allow admins to view all chats
create policy "Admins can view all chats"
  on public.chat_conversations for select
  using ( auth.role() = 'authenticated' );
