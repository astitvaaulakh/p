# 1minproduct

A modern, production-ready Amazon affiliate product discovery platform built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🛍️ **Public storefront** — browse products by category with smooth horizontal scrolling
- 🔍 **Live search** — instant results as you type
- 📱 **Fully responsive** — mobile-first design for all screen sizes
- 🔐 **Admin dashboard** — protected route with Supabase Auth
- 📦 **Product CRUD** — create, edit, and delete products with image upload
- 🗂️ **Category management** — dynamic homepage sections per category
- 🖼️ **Image storage** — Supabase Storage with lazy loading
- ⚡ **Fast** — SSR, ISR, optimized images, smooth animations

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd 1minproduct
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase-schema.sql`](./supabase-schema.sql)
3. Go to **Authentication → Users → Add user** and create your admin account

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

You can find these in **Supabase Dashboard → Settings → API**.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public routes (no /admin link)
│   │   ├── layout.tsx      # Navbar + Footer
│   │   └── page.tsx        # Homepage
│   ├── admin/              # Protected admin routes
│   │   ├── login/          # Login page
│   │   ├── products/       # Product CRUD
│   │   └── categories/     # Category management
│   ├── api/auth/callback/  # Supabase auth callback
│   ├── globals.css         # Global styles + design tokens
│   └── layout.tsx          # Root layout
├── components/
│   ├── public/             # Public-facing components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategorySection.tsx
│   │   ├── RecentlyAdded.tsx
│   │   └── SearchOverlay.tsx
│   ├── admin/              # Admin dashboard components
│   │   ├── Sidebar.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductTable.tsx
│   │   ├── CategoryManager.tsx
│   │   └── ImageUpload.tsx
│   └── ui/                 # Reusable primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   ├── server.ts       # Server Supabase client
│   │   └── middleware.ts   # Auth middleware helper
│   ├── types.ts            # Shared TypeScript types
│   └── utils.ts            # Utility functions
└── middleware.ts            # Next.js middleware (auth guard)
```

---

## Admin Dashboard

Access at `/admin` — you will be redirected to login if not authenticated.

After logging in, you can:
- **Products** — add, edit, delete products
- **Categories** — create categories (each becomes a homepage section)
- **Image upload** — drag-and-drop images stored in Supabase Storage

---

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

---

## Database Schema

See [`supabase-schema.sql`](./supabase-schema.sql) for the complete schema including:
- Tables: `categories`, `products`
- Row Level Security policies
- Storage bucket setup

---

## Affiliate Disclosure

As an Amazon Associate, we may earn from qualifying purchases.
