# Supabase setup

This takes only a few dashboard steps.

## 1. Create a Supabase project

Create a project at Supabase.

## 2. Run the database SQL

Open:

**SQL Editor → New query**

Paste and run:

`supabase/schema.sql`

This creates:

- `categories`
- `photos`
- `admin_users`
- Row Level Security policies
- Storage access policies
- Starter categories

## 3. Create the photo Storage bucket

Open:

**Storage → New bucket**

Use exactly:

`portfolio`

Turn **Public bucket** ON.

The browser uploads still remain protected by the Storage RLS policies in `schema.sql`; only an authenticated user listed in `admin_users` can upload/update/delete.

## 4. Create Abood's Auth account

Open:

**Authentication → Users → Add user**

Create his email + password account.

Copy his user UUID.

## 5. Make that account an admin

In SQL Editor run:

```sql
insert into public.admin_users (user_id)
values ('PASTE_ABOODS_AUTH_USER_UUID_HERE');
```

Do not put the service-role key anywhere in this React project.

## 6. Add frontend environment variables

In the project root, copy:

`.env.example`

to:

`.env`

Then add your real values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Find them in your Supabase project API settings.

## 7. Run the project

```bash
npm install
npm run dev
```

Public site:

`http://localhost:5173/`

Private admin:

`http://localhost:5173/admin`

## How Abood uses it

1. Sign in at `/admin`.
2. Create a category, e.g. `Weddings`.
3. Choose that category.
4. Pick a photo.
5. Add title/location if wanted.
6. Enable **Show on homepage** for the best images.
7. Upload.
8. The image appears automatically on the public portfolio.

## Vercel

Add the same two `VITE_...` variables in the Vercel project's Environment Variables settings, then redeploy.

## Important security note

Only use the Supabase **publishable key** in the React/Vite app.

Never place the Supabase service-role key in `.env`, GitHub, Vercel frontend variables, or React source code.
