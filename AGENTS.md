# Project architecture

Yassin Art is an Arabic-first Next.js 15 App Router literary platform. The root document is `lang=ar` and `dir=rtl`. Keep Arabic product copy, a calm night-reading aesthetic, copper accents, and readable Arabic typography. CSS uses Amiri for literary display and reading and IBM Plex Sans Arabic for interface text.

## Directories

- `app/`: home, searchable library, dynamic reader, visitor publishing, accounts, administration, about, and error states.
- `components/`: navigation, footer, shared Identity context, reader, manual purchase flow, support and a deterministic FAQ guide.
- `components/ui/`: code-native typographic book covers, reading cards and accessible native audio player.
- `lib/books.ts`: ten original short editions with complete section text. `lib/features.ts`: additional original art/music/image content.
- `lib/api.ts`: browser API helper and serialized record types.
- `db/schema.ts`: Drizzle tables for moderated submissions and manual purchase orders. `db/index.ts` lazily constructs the database client.
- `netlify/functions/platform.mts`: modern Netlify Function routing `/api/platform/:action`; contains authorization and all mutable database operations.
- `netlify/database/migrations/`: deploy-time migrations, generated with the installed Drizzle beta version.
- `public/`: saved original visuals, vector fallback, art illustration and synthesized WAV.
- `scripts/generate-art.mjs`: one-time AI Gateway artwork creation utility.

## Conventions and constraints

Use TypeScript, functional React components, Next.js Link, logical RTL spacing, explicit input labels, and accessible controls. Put sensitive authorization decisions on the server. Treat submitted text as plain text and never render it as untrusted HTML. Maintain error, empty, loading and success states. Avoid unnecessary new dependencies. No credentials, initial passwords or secret values belong in source or documentation.

Persistence must use Netlify Database; do not introduce Supabase, local JSON stores, or process-memory records. Use `@netlify/database` with `drizzle-orm@beta` and `drizzle-kit@beta` (the adapter is on the beta line). Add a migration for every schema change using `npx drizzle-kit generate --name descriptive_action`. The platform applies migrations; never apply them manually to production.

Netlify Identity is used via `@netlify/identity`. The activation marker under `.netlify/features/` is intentionally tracked. The first administrator must be invited or registered with confirmed owner email and assigned the server-controlled `admin` role in the Netlify dashboard. Both conditions are checked server-side. The ten-click brand gesture is navigation only. User metadata must never grant administrative privileges. Callback processing lives in PlatformProvider, including invite and password recovery flows.

All book prices are 30 MAD. Reading is free. PayPal.me is only a manual payment destination: never claim that visiting a link verifies payment. Payment transaction references are normalized and unique. Administrator confirmation must follow actual verification in PayPal. The 1 USD visitor-sale platform fee is recorded separately and settled manually; do not subtract USD directly from MAD or represent it as an automated payment split. Never expose buyer emails or transaction IDs in seller responses.

The ten initial works are short original AI-assisted editions, openly disclosed. Do not misrepresent them as full-length novels or assign them to a real author. Keep the supplied titles, including `ثياب الأما`, unless the owner requests a change. Downloaded paid editions are offline HTML with optional browser PDF printing; full reading is already public.

The FAQ assistant uses predefined platform answers without external AI inference. It should stay truthful about manual review and payments. No unsolicited runtime AI costs are needed. Image generation goes through the managed AI Gateway, and raster assets are served through Netlify Image CDN. Do not add an Open Graph image; the platform supplies it.

Run local development with `netlify dev --port 8889` when permitted. The platform's automatic build pipeline performs validation; follow the current run's restrictions on local build, start and test commands. Do not create commits or pull requests directly in managed runs.
