# Application architecture

## Product areas

- `app/(marketing)`: public landing pages and editorial campaigns.
- `app/(explore)`: destinations, places, maps, search, weather, and practical guides.
- `app/(planner)`: itinerary generation, manual planning, budgets, saved trips, and exports.
- `app/(account)`: authentication, profile, reviews, favorites, and personal trips.
- `app/admin`: protected content management and moderation.
- `src/features`: feature-owned components, queries, mutations, schemas, and tests.
- `src/components`: shared UI primitives and layout components only.
- `src/lib`: infrastructure clients and cross-cutting utilities.
- `src/types`: shared domain and generated database types.
- `supabase/migrations`: ordered, immutable database changes.

Route groups should be introduced as each product slice is built. Avoid moving the current homepage until the first shared site shell is ready.

## Data decisions

`places` uses a category enum for accommodation, restaurants, guides, activities, and transport. Common fields stay searchable and map-friendly; category-specific values live in `attributes` until a requirement deserves a normalized table.

Media files live in the `travel-media` storage bucket. `media_assets` stores ownership, accessibility text, credit, ordering, and the single entity to which each asset belongs.

Every browser-accessible table has row-level security. Public content is readable only when published, travelers own their personal data, and editor/admin capabilities are checked through `is_content_manager()`.

## Supabase workflow

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill the public URL and anon key.
3. Install the Supabase CLI and run `supabase link --project-ref <ref>`.
4. Apply migrations with `supabase db push`.
5. Load development content with `supabase db reset` locally, or run `supabase/seed.sql` in a non-production environment.
6. After every schema change, regenerate TypeScript types and replace `src/types/database.ts` with the generated result.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or prefix it with `NEXT_PUBLIC_`.
