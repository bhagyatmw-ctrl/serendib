# Serendib — Sri Lanka Travel Companion

Serendib is an interactive Sri Lanka travel hub for discovering destinations, planning personalized journeys, estimating costs, checking live travel information, saving favorites, and sharing useful reviews.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3002`.

## Environment

Copy `.env.example` to `.env.local` and add Supabase credentials when the data layer is connected.

The initial schema, row-level security policies, media bucket, and seed destinations live in `supabase/`. See `docs/architecture.md` for the data model and development workflow.

## Available product areas

- Responsive destination discovery with search and interest filters
- Detailed destination pages with weather, stays, food, experiences, and transport guidance
- Personalized day-by-day itinerary builder with editable activities and cost estimates
- Supabase authentication, traveler profiles, saved journeys, favorites, and reviews
- Editorial Sri Lanka travel stories
- Live currency and weather integrations, packing checklist, and emergency contacts

## Remaining delivery work

See [`docs/completion-audit.md`](docs/completion-audit.md) for the prioritized release checklist. The major remaining areas are a global places directory and map, admin content workflows, itinerary export, broader automated testing, licensed local media, and production deployment.

## Media policy

The current image URLs are visual-development placeholders. Before launch, replace them with licensed, locally optimized AVIF/WebP assets and record creator/source/alt-text metadata. Add the hero reel as described in `public/media/README.md`; do not commit unlicensed tourism footage.

## Deployment

The app is structured for Vercel. Connect the repository, configure environment variables, and use `pnpm build` as the release gate. Supabase provides PostgreSQL, authentication, and media storage.
