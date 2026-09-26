# Life OS

**The operating system for your life.**

Life OS is a connected personal workspace for defining direction, turning goals into projects, moving milestones, completing actions, keeping habits, and preserving the history of what actually happened. The first release prioritizes a coherent personal operating system over a collection of disconnected productivity features.

## Included in this release

The runnable app includes a dark premium workspace with responsive desktop and mobile navigation, Today / Daily Mission, connected Life Map, goals, projects, milestones, tasks, habits, journal, timeline, focus mode, weekly review, Reality Mirror, Momentum, Drift Detector, Decision Vault, Challenges, Templates, Archive, global search, command palette, quick capture, JSON export, local persistence, a PWA manifest, and a service worker shell cache.

The client state is local-first through `localStorage`, which keeps the core personal workspace usable without an external AI provider or paid API. The server foundation is typed and user-owned: Manus OAuth is available through the scaffold, the Drizzle schema contains the core relational entities, and protected tRPC procedures cover snapshots, goal creation, project creation, and task completion.

## Design direction

Life OS uses charcoal surfaces, a restrained lime accent, Space Grotesk display type, DM Sans body type, fine borders, sparse glass treatment, subtle glow, and short purposeful transitions. The interface is intentionally calm rather than gamified. Metrics are derived from stored task, milestone, goal, and habit state; no fake AI or psychological conclusions are used.

## Local development

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm check
pnpm test
pnpm drizzle-kit generate
pnpm build
```

The development workspace starts with realistic seed data in the browser. Use **Settings → Development reset** to restore it. The browser state key is `life-os-state-v1`; removing that key also resets the local workspace.

## Deploy to Vercel

This repository includes `vercel.json` and is ready for a **Vite static deployment**. The Vercel build intentionally uses `pnpm build:vercel`, which builds `dist/public` without starting the local Express server. The app is local-first and uses the browser-safe Supabase client for optional cloud sync.

1. Import the repository or upload this ZIP to Vercel.
2. Keep the detected framework as **Vite**.
3. Vercel will use the included build command and output directory automatically:
   - Install: `pnpm install --frozen-lockfile`
   - Build: `pnpm build:vercel`
   - Output: `dist/public`
4. Add these Production environment variables in Vercel if cloud sync is desired:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Run `supabase/migrations/001_life_os_workspaces.sql` in the Supabase SQL editor before enabling cloud sync.

The included SPA rewrite keeps direct links such as `/app/goals`, `/app/map`, and `/app/reviews` working after deployment. The original `pnpm build` and `pnpm dev` commands remain available for the full local Express/server workspace.

## Supabase cloud sync

Life OS remains local-first, but signed-in users can sync one private workspace snapshot across browsers with Supabase. Set `VITE_SUPABASE_URL` to the project API URL and `VITE_SUPABASE_PUBLISHABLE_KEY` to the browser-safe publishable/anon key, then run `supabase/migrations/001_life_os_workspaces.sql` in the Supabase SQL editor. The sidebar uses passwordless email magic links; users who do not sign in continue using local storage only.

## Data model

The schema in `drizzle/schema.ts` covers users, profiles, life areas, goals, projects, milestones, tasks, habits and habit logs, journal entries, timeline events, decisions, and focus sessions. Each private record carries a `userId` ownership boundary. Indexes are included for user, date, and relationship lookups. The generated migration lives in `drizzle/0001_curious_blockbuster.sql` and has been applied to the managed database.

## Offline and sync strategy

The client is usable offline for the core personal surface because interactions update local state immediately and the service worker caches the app shell. The typed server layer is ready for authenticated synchronization. A production sync pass should add an operation log with client timestamps, stable IDs, and conflict rules that prefer explicit user edits over derived metrics, while preserving both versions for journal and decision records.

## Environment

Copy `.env.example` to `.env` only for local development when a local environment needs explicit values. Managed WebDev environments provide the system secrets automatically; do not commit real credentials.

## Product roadmap

The architecture is prepared for onboarding, deeper analytics, public journeys, shareable Life Cards, challenge forking, advanced exports, conflict-aware cloud sync, and the future Life Graph. The north-star relationship remains:

`VISION → GOALS → PROJECTS → MILESTONES → TASKS → ACTIONS → RESULTS → TIMELINE → LIFE HISTORY`

## Quality notes

The current test suite covers authentication logout behavior plus deterministic mission and progress calculations. The visual QA pass verified desktop Today, Life Map, Goals, Settings, and the 390px mobile breakpoint.
