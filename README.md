# ModLift — React + Vite

This app uses React, Vite, Tailwind v4, and Supabase.

## Scripts

- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Supabase Setup

1. Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=...your supabase url...
VITE_SUPABASE_ANON_KEY=...your anon key...
```

2. In the Supabase SQL editor, run `supabase/policies.sql` to create tables (`vehicles`, `images`, `builds`) and permissive RLS policies for local testing.

3. Restart Vite after changing `.env`.

Pages that query Supabase:
- `src/pages/BuildYourSetup.jsx`
- `src/components/GalleryPreview.jsx`
- `src/utils/saveBuild.js`
