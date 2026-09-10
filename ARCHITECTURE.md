# Architecture

The app uses Next.js App Router with server components for protected reads and server actions for mutations. Supabase Auth owns credentials and sessions; PostgreSQL stores application data through Prisma.

Domain boundaries:

- `src/app`: routes and page composition
- `src/components`: reusable UI and client action-state forms
- `src/server/discovery`: limited introductions, interest, connection, and micro-conversation logic
- `src/server/interaction`: authorized chat, date proposals, safety, and meeting feedback
- `src/server/admin`: admin-only moderation mutations
- `src/lib`: authentication, Prisma, validation, and Supabase adapters

Chat uses short polling for the MVP rather than pretending to provide an event-driven transport. It can be replaced by Supabase Realtime later without changing authorization rules.