-- The Last Goodbye - Database Schema for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Friends Table
create table friends (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text unique not null,
  name text not null,
  passcode text not null,
  content text,
  image_url text,
  is_viewed boolean default false
);

-- 2. Visit Logs (The Spy Table)
create table visit_logs (
  id uuid default gen_random_uuid() primary key,
  friend_id uuid references friends(id) on delete cascade,
  visited_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address text,
  user_agent text,     -- Raw UA string
  device_type text,    -- e.g., 'mobile', 'tablet'
  device_model text,   -- e.g., 'iPhone', 'Samsung SM-G991'
  browser text,        -- e.g., 'Chrome', 'Line App'
  os text              -- e.g., 'iOS 17.2', 'Android 14'
);

-- 3. Create indexes for better query performance
create index idx_friends_slug on friends(slug);
create index idx_visit_logs_friend_id on visit_logs(friend_id);
create index idx_visit_logs_visited_at on visit_logs(visited_at);

-- 4. Storage bucket for memories/images
insert into storage.buckets (id, name, public) values ('memories', 'memories', true);

-- 5. Storage policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'memories' );
create policy "Admin Upload" on storage.objects for insert using ( bucket_id = 'memories' );

-- 6. Row Level Security (RLS) for tables
alter table friends enable row level security;
alter table visit_logs enable row level security;

-- Allow public read access to friends table (for fetching by slug)
create policy "Public read friends by slug" on friends for select using (true);

-- Allow public insert to visit_logs (for logging visits)
create policy "Public insert visit logs" on visit_logs for insert with check (true);

-- Allow public read of visit_logs (for admin viewing - in production, restrict this)
create policy "Public read visit logs" on visit_logs for select using (true);

-- Allow public update of friends (for marking as viewed - in production, restrict this)
create policy "Public update friends" on friends for update using (true);

-- Allow public insert of friends (for admin adding - in production, restrict this)
create policy "Public insert friends" on friends for insert with check (true);

-- Allow public delete of friends (for admin deleting - in production, restrict this)
create policy "Public delete friends" on friends for delete using (true);
