# kindred_

kindred_ is a context-first dating MVP for engineers and curious minds. It uses a finite set of introductions, mutual micro-conversations, and a gentle path from connection to an optional real-world plan.

## Run locally

See [SETUP.md](SETUP.md) for the complete setup:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Required environment variables are listed in [.env.example](.env.example). Authentication requires a Supabase project. Database commands require PostgreSQL through `DATABASE_URL`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test -- --run
npx playwright test
npm run build
```

## Product boundaries

The MVP intentionally does not include AI matching, compatibility scores, payments, subscriptions, public reputation, live rooms, or video/audio dating. Chat uses authorized short polling; Supabase Realtime can be introduced later without changing the data ownership rules.

Architecture, schema, security, API, and operational notes live in [ARCHITECTURE.md](ARCHITECTURE.md), [DATABASE.md](DATABASE.md), [SECURITY.md](SECURITY.md), [API.md](API.md), and [SETUP.md](SETUP.md).
