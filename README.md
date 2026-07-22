# Serendib — Sri Lanka Travel Companion

A deployment-ready foundation for the travel platform described in the project SRS. The first slice is a responsive, media-led discovery and trip-planning homepage.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and add Supabase credentials when the data layer is connected.

The initial schema, row-level security policies, media bucket, and seed destinations live in `supabase/`. See `docs/architecture.md` for the data model and development workflow.

## Delivery roadmap

1. Foundation: design system, navigation, Supabase schema, auth, destination CMS.
2. Planning: itinerary builder, cost model, saved trips, PDF export.
3. Discovery: searchable destinations, Leaflet maps, stays, food, guides, transport, activities.
4. Live services: Open-Meteo weather, currency conversion, favorites, reviews, stories, galleries.
5. Operations: admin workflows, analytics, moderation, accessibility, SEO, testing, production deployment.

## Media policy

The current image URLs are visual-development placeholders. Before launch, replace them with licensed, locally optimized AVIF/WebP assets and record creator/source/alt-text metadata. Add the hero reel as described in `public/media/README.md`; do not commit unlicensed tourism footage.

## Deployment

The app is structured for Vercel. Connect the repository, configure environment variables, and use `pnpm build` as the release gate. Supabase provides PostgreSQL, authentication, and media storage.
