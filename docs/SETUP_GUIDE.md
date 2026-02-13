# Setup Guide

This guide will help you set up The Last Goodbye application from scratch.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account (free tier works)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the project details:
   - Name: "the-last-goodbye" (or any name you prefer)
   - Database Password: Choose a strong password
   - Region: Select the closest region to you
5. Wait for the project to be created

## Step 2: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the following SQL commands:

```sql
-- 1. Friends Table
create table friends (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text unique not null,
  name text not null,
  passcode text not null,
  content text,
  image_url text, -- Deprecated, utilize image_urls array
  image_urls text[], -- Array of image URLs
  spotify_url text,
  bgm_url text, -- Background Music URL
  unlock_date timestamp with time zone default null,
  is_viewed boolean default false
);

-- 2. Visit Logs (The Spy Table)
create table visit_logs (
  id uuid default gen_random_uuid() primary key,
  friend_id uuid references friends(id) on delete cascade,
  visited_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address text,
  user_agent text,
  device_type text,
  device_model text,
  browser text,
  os text
);

-- 3. Replies Table (New Feature)
create table replies (
  id uuid default gen_random_uuid() primary key,
  friend_id uuid references friends(id) on delete cascade,
  content text not null,
  sender_name text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create indexes for better query performance
create index idx_friends_slug on friends(slug);
create index idx_visit_logs_friend_id on visit_logs(friend_id);
create index idx_visit_logs_visited_at on visit_logs(visited_at);
create index idx_replies_friend_id on replies(friend_id);
create index idx_replies_is_read on replies(is_read);

-- 5. Row Level Security (RLS)
alter table friends enable row level security;
alter table visit_logs enable row level security;
alter table replies enable row level security;

-- Public read access to friends table
create policy "Public read friends by slug" on friends for select using (true);

-- Public insert to visit_logs
create policy "Public insert visit logs" on visit_logs for insert with check (true);

-- Public read of visit_logs
create policy "Public read visit logs" on visit_logs for select using (true);

-- Public update of friends (for marking as viewed)
create policy "Public update friends" on friends for update using (true);

-- Public insert of friends
create policy "Public insert friends" on friends for insert with check (true);

-- Public delete of friends
create policy "Public delete friends" on friends for delete using (true);

-- Public insert replies
create policy "Public insert replies" on replies for insert with check (true);

-- Public read replies (for the friend page feed)
create policy "Public read replies" on replies for select using (true);

-- Public update replies (mark as read)
create policy "Public update replies" on replies for update using (true);
```

3. Click "Run" to execute the SQL

## Step 3: Get API Keys

1. In Supabase, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PIN=1234
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. Replace the values with your actual Supabase credentials and desired PIN.

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Background Music Configuration

You can configure available background music in `lib/bgm-config.ts`.
Simply add your MP3 files to the `public/bgm/` folder and update the config file:

```typescript
export const BGM_LIST = [
  { id: 'bgm-1', name: 'Song Title', url: '/bgm/song.mp3' },
  // ...
];
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PIN`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.vercel.app`)
5. Deploy!
