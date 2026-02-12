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
  image_url text,
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

-- 3. Create indexes for better query performance
create index idx_friends_slug on friends(slug);
create index idx_visit_logs_friend_id on visit_logs(friend_id);
create index idx_visit_logs_visited_at on visit_logs(visited_at);

-- 4. Row Level Security (RLS)
alter table friends enable row level security;
alter table visit_logs enable row level security;

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
```

2. Replace the values with your actual Supabase credentials

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 7: Add Your First Friend

1. Go to `http://localhost:3000/admin`
2. Click "จัดการเพื่อน" (Manage Friends)
3. Click "➕ เพิ่มเพื่อนใหม่" (Add New Friend)
4. Fill in the form:
   - Name: Friend's name
   - Slug: URL-friendly identifier (e.g., "john-doe")
   - Passcode: 4-digit PIN
   - Content: Your farewell letter

## Optional: Set Up Image Storage

If you want to add photos to your letters:

1. In Supabase, go to **Storage**
2. Click "New bucket"
3. Name it "memories"
4. Check "Public bucket"
5. Upload your images
6. Copy the public URL and paste it in the image_url field when adding friends

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Custom Domain

1. In Vercel, go to your project settings
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### "Missing Supabase environment variables" warning
Make sure your `.env.local` file exists and contains valid credentials.

### Database connection errors
- Check that your Supabase project is active
- Verify your API keys are correct
- Make sure RLS policies are properly set up

### Images not loading
- Ensure the storage bucket is public
- Check that the image URL is correct
- Verify the storage policies allow public read access

## Security Notes

⚠️ **Important**: The current RLS policies are permissive for ease of development. For production use, consider:

1. Adding authentication for admin routes
2. Restricting update/delete operations to authenticated users
3. Implementing rate limiting for visit logs
