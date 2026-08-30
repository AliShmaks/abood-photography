# Abood Al Husain Photography — React + Supabase CMS

A complete photographer portfolio built with:

- React
- Vite
- Motion for React / Framer Motion
- React Router
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Row Level Security

## What Abood can manage himself

Open the private route:

`/admin`

After logging in, Abood can:

- Add categories such as Weddings, Engagements, Portraits and Events
- Upload images into a chosen category
- Add title, location and alt text
- Choose the display order
- Mark/unmark photos as Featured
- Delete photos
- Delete empty categories

The public `/portfolio` page automatically reads categories and photos from Supabase.

Featured Supabase photos automatically appear on the homepage.

## Important

Read:

`supabase/SETUP.md`

That file contains the exact setup steps.

Run:

```bash
npm install
npm run dev
```

## Change Abood's normal website information

Edit:

`src/data/siteData.js`

That still controls his:

- Name
- Phone
- WhatsApp
- Email
- Instagram
- About text
- Services
- Testimonials
- Hero text

## Hero portrait

Replace:

`public/images/abood-hero-placeholder.jpg`

with Abood's real portrait and keep the same filename.

## Supabase environment

Copy:

`.env.example`

to:

`.env`

Then fill in:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Never expose a Supabase service-role key in this frontend project.

## Before Supabase is connected

The site intentionally falls back to the local sample portfolio photos in `src/data/siteData.js`.

That means you can run and design the website immediately, then connect Supabase later without the portfolio breaking.

## Supabase connection status

This ZIP is already connected to the Supabase project:

`qwutdvdkxvxrrgzczfej`

The local `.env` file already contains the project URL and publishable browser key.

You still need to complete the one-time dashboard setup in:

`supabase/SETUP.md`

Specifically:
- Run `supabase/schema.sql`
- Create the public `portfolio` Storage bucket
- Create Abood's Auth user
- Add his Auth user UUID to `public.admin_users`

Do not add any `sb_secret_...` key to this project.
