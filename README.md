# The Last Goodbye 💌

A sentimental digital message platform for high school graduation with an Advanced Analytics (Spy) System to track user engagement.

## Features

### 🎭 Public Features
- **QR Code Scanning**: Friends scan personalized QR codes to access their letters
- **Countdown Timer**: Letters are locked until specific date (Default: Feb 20, 2026)
- **PIN Protection**: 4-digit passcode authentication
- **Beautiful Letter Display**: Handwriting-style font (Mali), memories gallery, and Spotify integration
- **Background Music (BGM)**: Immersive experience with selected background music
- **Reply System**: Friends can send a reply message back to you directly from their letter page

### 🕵️ Admin Features
- **Dashboard**: Overview of all friends and their letter status
- **Analytics/Spy Logs**: Track who scanned, when, and what device they used
- **CRUD Operations**: Add, edit, and delete friend entries
- **Live Preview**: See exactly what your friend will see before sending
- **Reply Notifications**: Get notified when a friend replies to your letter
- **Device Detection**: Identify device type, browser, OS, and IP address

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS, Framer Motion
- **Fonts**: IBM Plex Sans Thai (UI), Mali (Letter content)

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/the-last-goodbye.git
cd the-last-goodbye
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PIN=your_admin_pin
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Set up the database:
- Go to your Supabase dashboard
- Navigate to SQL Editor
- Run the SQL commands from `db_update.sql` (and `lib/db_schema.sql` for initial setup)

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── [slug]/           # Dynamic friend pages
│   ├── admin/            # Admin dashboard
│   │   ├── analytics/    # Spy logs
│   │   ├── friends/      # Friend management
│   │   └── notifications/# Reply messages
│   ├── actions/          # Server actions
│   │   ├── tracking.ts   # Visit logging
│   │   ├── admin.ts      # Admin operations
│   │   └── replies.ts    # Reply system
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # React components
├── lib/                  # Utilities
│   ├── bgm-config.ts     # Background music configuration
│   ├── db_schema.sql     # Initial DB schema
│   ├── supabase.ts       # Supabase client
│   └── types.ts          # TypeScript types
└── docs/                 # Documentation
```

## Documentation

- [Setup Guide](docs/SETUP_GUIDE.md) - Detailed setup instructions
- [User Manual (Thai)](docs/USER_MANUAL.md) - คู่มือการใช้งาน

## License

This project is for personal use.

---

Made with ❤️ for my graduating class
