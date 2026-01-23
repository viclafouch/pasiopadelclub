# Pasio Padel Club

Modern booking platform for Pasio Padel Club, a padel facility located in Bayonne, France. Built to replace a legacy Wix website with a fully responsive, SEO-optimized booking experience.

## Features

- Online court booking with real-time availability
- Secure payments via Stripe (checkout, refunds)
- Credit wallet system with bonus packs
- User authentication (email/password)
- Responsive design for mobile and desktop
- Admin dashboard (coming soon)
- Transactional emails (booking confirmation, reminders)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, SSR, Nitro) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| Forms | [TanStack Form](https://tanstack.com/form) |
| Database | [Drizzle ORM](https://orm.drizzle.team/) + [Neon](https://neon.tech/) (Postgres serverless) |
| Auth | [Better Auth](https://better-auth.com/) |
| Payments | [Stripe](https://stripe.com/) |
| Email | [Resend](https://resend.com/) + [React Email](https://react.email/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Validation | [Zod](https://zod.dev/) |

## Infrastructure

| Service | Purpose |
|---------|---------|
| [Railway](https://railway.com/) | Hosting (Node.js, auto-deploy) |
| [Neon](https://neon.tech/) | PostgreSQL database |
| [Stripe](https://stripe.com/) | Payment processing |
| [Resend](https://resend.com/) | Transactional emails |

## Prerequisites

- Node.js 24.4.1+
- npm 11.8.0+
- A Neon database
- Stripe account (test or live)
- Resend account

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd pasiopadelclub
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `VITE_SITE_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Session encryption key (min 32 chars). Generate with: `openssl rand -base64 32` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...` or `pk_live_...`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `RESEND_API_KEY` | Resend API key (`re_...`) |

Optional (for development):

| Variable | Description |
|----------|-------------|
| `EMAIL_OVERRIDE_TO` | Redirect all emails to this address |
| `EMAIL_OVERRIDE_FROM` | Override sender (for Resend free tier) |

### 3. Database setup

Push the schema to your database and seed initial data:

```bash
npm run db:push
npm run db:seed
npm run db:seed:credit-packs
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Stripe Webhooks

Stripe webhooks are essential for the booking flow. When a payment succeeds, the webhook creates the reservation in the database.

### Local Development

Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhook events to your local server:

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will output a webhook signing secret (`whsec_...`). Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### Production

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
4. Copy the signing secret to your production environment

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint:fix` | Run ESLint and fix issues |
| `npm run db:push` | Push Drizzle schema to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:seed` | Seed courts data |
| `npm run db:seed:credit-packs` | Seed credit packs |
| `npm run email:dev` | Preview email templates on port 3001 |
| `npm run cron:reminder` | Run booking reminder cron job |
| `npm run cron:retention` | Run data retention cron job |

## Project Structure

```
src/
├── server/      # Server functions (auth, bookings, payments)
├── routes/      # Pages (TanStack Router file-based routing)
├── components/  # React components
├── constants/   # Types, queries, schemas
├── helpers/     # Pure utility functions
├── utils/       # Business logic utilities
├── db/          # Drizzle schema and seeds
├── emails/      # React Email templates
└── lib/         # Config (auth, stripe, resend)
```

## Deployment

The app is configured for deployment on Railway with automatic deploys from the `main` branch.

### Railway Setup

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy

Railway will automatically:
- Install dependencies
- Build the app (`npm run build`)
- Start the server (`npm run start`)

## License

Private - All rights reserved
