# Pasio Padel Club

Showcase website for Pasio Padel Club, a padel facility located in Bayonne, France. Built to replace a legacy Wix website with a fully responsive, SEO-optimized experience.

> **Branch `production-v1`** — Static showcase site (no backend, no auth, no payments). All booking CTAs redirect to the mobile app. The `main` branch contains the full-featured version with database, auth, Stripe payments, and email system.

## Features

- Responsive design for mobile and desktop
- SEO-optimized pages (tarifs, contact, galerie, credits)
- Google Maps integration
- Mobile app download promotion
- Static credit packs presentation

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, SSR, Nitro) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Animation | [Motion](https://motion.dev/) |
| Validation | [Zod](https://zod.dev/) |

## Infrastructure

| Service | Purpose |
|---------|---------|
| [Railway](https://railway.com/) | Hosting (Node.js, auto-deploy from `production-v1`) |

## Prerequisites

- Node.js 24.4.1+
- npm 11.8.0+

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd pasiopadelclub
git checkout production-v1
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `VITE_SITE_URL` | Your app URL (e.g., `http://localhost:3000`) |

### 3. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint:fix` | Run TypeScript check + ESLint and fix issues |
| `npm run test` | Run unit tests with Vitest |
| `npm run deps` | Update dependencies (minor/patch) |
| `npm run clean` | Clean build output and cache |

## Project Structure

```
src/
├── routes/      # Pages (TanStack Router file-based routing)
├── components/  # React components (ui/, kibo-ui/, animate-ui/)
├── constants/   # App constants and configs
├── helpers/     # Pure utility functions
├── lib/         # Shared utilities (cn)
└── env/         # Environment variable validation
```

### Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/tarifs` | Court pricing |
| `/credits` | Credit packs presentation |
| `/galerie` | Photo gallery |
| `/contact` | Contact info + Google Maps |
| `/application` | Mobile app download |
| `/cgv` | Terms of service |
| `/mentions-legales` | Legal notices |
| `/politique-confidentialite` | Privacy policy |

## Deployment

The app is configured for deployment on Railway with automatic deploys from the `production-v1` branch.

### Railway Setup

1. Create a new project on Railway
2. Connect your GitHub repository
3. Set the deploy branch to `production-v1`
4. Add `VITE_SITE_URL` environment variable
5. Deploy

Railway will automatically:
- Install dependencies
- Build the app (`npm run build`)
- Start the server (`npm run start`)

## License

Private - All rights reserved
