# nextjs-starter-premium (one-time payment)

A typed Next.js starter with authentication (credentials, OAuth, email verification, two-factor), a Postgres database and **one-time Stripe payments** already wired together.

Built in early 2025 as the full-featured kit of a commercial starter series, now published as is. It targets **Next.js 15**, React 19, Tailwind 3 and Auth.js v5 beta. Check [Age of this code](#age-of-this-code) before using it for a new project.

> This is the `one-time-payment` branch. The other payment model is on the [`subscription`](../../tree/subscription) branch. They share the same base and differ only in how Stripe is integrated.

## What is in it

- **Auth.js v5**: email and password (bcrypt), Google and Facebook OAuth, email verification, password reset, optional two-factor codes by email (Resend), session helpers, route protection in `middleware.ts`
- **Drizzle ORM** on **Neon** serverless Postgres: users, accounts, tokens, two-factor confirmation, posts, and Stripe payment records
- **Stripe**: payment intent endpoint, checkout form (Stripe Elements), a server action that records each transaction
- **UI**: Tailwind 3, shadcn/ui (Radix), dark mode, react-hook-form with zod validation, a dashboard and profile page
- **Tooling**: ESLint (flat config, `next/core-web-vitals`), Prettier with import sorting, strict TypeScript

## Getting started

```bash
git clone -b one-time-payment --single-branch https://github.com/tinmartinic/nextjs-starter-premium.git
cd nextjs-starter-premium
npm install
cp .env.example .env.local   # then fill it in, every variable is explained inside
npx drizzle-kit generate
npx drizzle-kit migrate
npm run dev
```

You need a free [Neon](https://neon.tech) database, Stripe test keys and a [Resend](https://resend.com) key. Google and Facebook credentials are optional.


| Script | Does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build, also generates the sitemap |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Structure

```
app/            routes: pages, auth screens, dashboard, API routes (Auth.js, Stripe)
actions/        server actions (auth, email, tokens, payments)
components/     ui/ (shadcn), auth/, layout/, global/
data/           database queries, one file per table
lib/            db (Drizzle client and schema), auth, mail, Stripe, validation schemas
models/         inferred TypeScript types from the schema
routes.ts       every route constant in one place
middleware.ts   route protection
```

## Age of this code

- Next.js 15.2, Auth.js `5.0.0-beta.25`, Drizzle 0.40, Tailwind 3. Upgrading to Next 16 and Tailwind 4 is straightforward but not done here.
- No automated tests. `npm run typecheck`, `npm run lint` and `npm run build` pass.
- The simpler kit without OAuth, email and subscriptions is [`nextjs-starter-basic`](https://github.com/tinmartinic/nextjs-starter-basic).

## Author

Built by [Neviox Digital](https://nevioxdigital.com) ([GitHub](https://github.com/Neviox-Digital-Agency), [LinkedIn](https://www.linkedin.com/in/martinictin/)).

## License

MIT
