# 💌 The Last Goodbye

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://graduate.chatan.in.th/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**[View Live Demo →](https://graduate.chatan.in.th/)**

![Hero Banner/OG Image](./public/og-image.png)

A modern, minimal, and heartfelt digital message platform crafted for high school graduation. **The Last Goodbye** serves as a secure, personalized digital yearbook where friends can scan their unique QR codes to unlock a heartfelt letter, view shared memories, listen to a dedicated song, and securely reply—all packaged in a beautiful Polaroid aesthetic.

Built with performance and emotion in mind, it features an **Advanced Analytics (Spy) System** allowing the administrator to track who scanned their letter, when, and from what device.

---

## ✨ Features

### 💝 For Your Friends (Public Interface)
*   **Personalized QR Codes:** Each friend gets a unique link and QR code to access their letter.
*   **Time-locked Memories:** Letters are securely locked behind a countdown timer (Default: Feb 20, 2026).
*   **PIN Protection:** A 4-digit passcode ensures that only the intended recipient can read their letter.
*   **Beautiful Presentation:** Handwriting-style typography (Mali font), an interactive polaroid memories gallery, and integrated Spotify track displays.
*   **Immersive Audio:** Selected background music (BGM) plays automatically (or via a mute toggle) when the letter is opened.
*   **Two-Way Replies:** Friends can send a private or public reply message directly from their letter page.

![Unlock Animation]()

### 🕵️ For You (Admin Dashboard)
*   **Advanced Spy Analytics:** Track visit logs detailing who scanned, the exact time, device type, browser (including in-app browsers like LINE/IG), OS, and IP address.
*   **Friend Management (CRUD):** Easily add, edit, and delete friend entries with a clean, responsive UI.
*   **Live Preview:** Instantly see exactly how the letter will render for your friend before finalizing the content.
*   **Reply Notifications:** A dedicated inbox to read and filter (Public/Private) heartfelt replies from your friends.
*   **CSV Export:** Quickly export all friend data and unique links for easy printing.

![Admin Panel]()

---

## 🛠 Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
*   **UI Library:** React 19
*   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Typography:** IBM Plex Sans Thai (UI), Mali (Letter content)
*   **Rich Text Editor:** [Tiptap](https://tiptap.dev/) (HTML to Markdown synchronized)

---

## 🚀 Setup Instructions

### Prerequisites
*   Node.js 18+
*   A free [Supabase](https://supabase.com/) account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/the-last-goodbye.git
cd the-last-goodbye
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in the `.env.local` file with your details:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Security
# This 4+ digit PIN acts as the master password for the /admin dashboard
ADMIN_PIN=1234

# Deployment URL
# Important for generating dynamic QR codes and CSV exports
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup
1. Log in to your Supabase dashboard.
2. Navigate to the **SQL Editor**.
3. Copy the contents of `lib/db_schema.sql` (and subsequently `db_update.sql` if updating from an older version) and run the queries to create the necessary tables.

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. To access the admin panel, navigate to `/admin` and enter your `ADMIN_PIN`.

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

---

*Made with ❤️ for my graduating class.*
