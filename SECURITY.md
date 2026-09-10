# Security

- Supabase Auth stores passwords; this app never stores password plaintext or hashes.
- Protected pages use middleware and server-side `requireUser` checks.
- Every interaction mutation resolves the authenticated application user and checks connection membership.
- Message reads and sends are limited to connection members; closed or paused connections cannot send messages.
- Profile discovery omits email, auth IDs, verification documents, and exact location.
- Photos use storage keys, not database blobs. Upload validation must be enforced before adding a storage route.
- Blocks close a connection and prevent further conversation access.
- Reports are private and visible only to authorized admins.
- User text is length-validated with Zod and rendered as text, not HTML.

Remaining production work includes rate limiting, image moderation, storage upload endpoints, audit logging, and a formal privacy/account-deletion workflow.