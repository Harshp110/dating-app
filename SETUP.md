# Local Setup

Requirements: Node.js 20+, PostgreSQL, and a Supabase project.

1. Copy `.env.example` to `.env.local`.
2. Fill in the Supabase and PostgreSQL variables.
3. Run `npm install`.
4. Run `npm run db:generate` and `npm run db:push`.
5. Run `npm run db:seed` for fictional seed data.
6. Run `npm run dev`.

Quality commands: `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`.

The E2E suite requires a configured Supabase/PostgreSQL environment and a running app. No external service credentials are committed.