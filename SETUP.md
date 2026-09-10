# Local Setup

Requirements: Node.js 20+, PostgreSQL, and a Supabase project.

1. Copy `.env.example` to `.env.local`.
2. In Supabase Dashboard, open **Project Settings > API** and copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL` and the **Publishable key** (or legacy `anon` key) into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Set `NEXT_PUBLIC_SITE_URL` to `http://localhost:3000` for local development and add that URL plus `/auth/callback` to the Supabase Auth redirect URL allowlist.
4. Fill in `DATABASE_URL` with your PostgreSQL connection string.
5. Run `npm install`.
6. Run `npm run db:generate` and `npm run db:push`.
7. Run `npm run db:seed` for fictional seed data.
8. Run `npm run dev`.

`.env.local` is ignored by Git. Never put a Supabase service-role key, database password, or other secret in source code, `.env.example`, or a `NEXT_PUBLIC_` variable.

Quality commands: `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`.

The E2E suite requires a configured Supabase/PostgreSQL environment and a running app. No external service credentials are committed.