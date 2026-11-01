# ياسين آرت — Yassin Art

An Arabic literary platform with an RTL night-reading interface, free full-text reading, ten original short literary editions, art and music, moderated visitor publishing, and optional digital ownership at **30 MAD per book**.

## Technology

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide icons, Netlify Identity, and Netlify Database with Drizzle ORM. Platform requirements use Netlify's managed Postgres and Identity rather than Supabase. No external database credentials are needed.

## Local development

```sh
npm install
netlify link
netlify dev --port 8889
```

Use the Netlify development environment for Identity, serverless APIs, database connections and Image CDN. A plain `next dev` server alone does not emulate those services. The deployment pipeline runs the production build and applies the generated migrations automatically. Do not run database push or migrations manually against production.

## First administrator setup

Identity activation is included in the project. After deployment:

1. Open the project's Netlify dashboard and its **Identity** page.
2. Invite the owner at **yassinmalloukqhse@gmail.com** (or let that address register and confirm its email).
3. The owner accepts the invitation and chooses a password through the site's account screen.
4. Open that user in Identity and add the **admin** role, then sign out and back in to refresh authorization.
5. Ten consecutive clicks on the **ياسين آرت** name or feather open `/account?admin=1`, or `/admin` when already authorized. A pause longer than four seconds resets the click counter.

All privileged API actions require both that exact confirmed owner email and the server-controlled `admin` role. The click gesture only reveals the entrance. No initial password is embedded or provisioned by this repository.

## Content and publishing

- `lib/books.ts` contains ten complete **short** editions, each with three sections. They were newly composed with AI assistance from the supplied titles. Their origin and short format are disclosed to readers; they are not represented as pre-existing published books or full-length novels.
- The requested titles, including `انين الصمت` and `ثياب الأما`, are preserved. The last title is woven into its story rather than silently corrected.
- `lib/features.ts` adds original editorial art commentary, a generated night scene, and a 24-second synthesized soundscape.
- Visitors sign up, confirm email, and submit text or a short book at `/publish`. Text publishing supports up to 80,000 characters; uploaded audio, pictures, PDFs and other files are not part of this version.
- Work is saved privately as pending. The owner reads it in full at `/admin` and approves, rejects, or returns it to review. Only approved work appears publicly. Visitors can read their own full submissions and status from `/account`.

## Payment behavior

The provided PayPal.me link is used for **manual** payments and optional donations. There is no payment gateway API connection, automatic transaction verification, webhook, split payment, automatic currency conversion, or automatic author payout.

An authenticated reader creates a 30 MAD order, pays the equivalent using an available PayPal currency, and submits the PayPal transaction ID. PayPal does not directly support MAD. The administrator verifies the actual PayPal transaction, its amount and the order reference, then confirms or rejects the order. A unique database constraint prevents the same normalized transaction ID being submitted to multiple orders. Confirmed readers can save an offline HTML edition from the book's purchase section and print it as PDF. Full reading remains free.

For visitor books, each order records a **1 USD** platform fee separately from the 30 MAD gross price. The administrator manually settles author proceeds with the writer and marks the payout settled. Exchange rates and PayPal fees need to be checked at settlement time. A donation is independent of book ownership. Suggested donation amounts are displayed in MAD, but the donor enters the corresponding amount and currency in PayPal.

The help widget is an explicit, rule-based platform guide, not a general-purpose AI chatbot. Its responses cover reading, publishing, purchases, donations, accounts and contact information. It makes no financial confirmations.

## Storage and deployment

The schema is in `db/schema.ts`. Drizzle migrations are committed under `netlify/database/migrations/` for automatic application by the platform. Publication and order state persist in Netlify Database. No user records are stored in local files or process memory. Browser UI state such as font size and the selected category is temporary.

The main generated artwork is saved locally and served through Netlify Image CDN. `scripts/generate-art.mjs` can regenerate it with the managed AI Gateway; it is an asset creation utility, not a runtime image generator. The site includes a code-native SVG fallback.

This implementation was reviewed by reading its source and migration files. Build, type validation, deployment and live payment/authentication verification are performed by the deployment workflow; no local build or server validation was run during creation.
