# Zazi

A digital home for Africa's next generation — a youth development and learning platform for Grades 7–12, built as a mobile-first, responsive React app.

**Learn. Create. Connect. Lead.**

## Stack

- React 19 + Vite
- Tailwind CSS
- React Router (client-side routing)
- lucide-react icons

State is currently in-memory via `src/context/AppContext.jsx` (no backend yet) — it's structured to be swapped for a real API without touching the screens.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173. The app is mobile-first: use your browser's device toolbar (or just resize the window narrow) to see the primary experience, and widen it to see the responsive desktop layout.

## Project structure

```
src/
  components/   AppShell, Sidebar, BottomNav, AuthShell, DashboardShell — layout & nav
  context/      AppContext.jsx — shared app state (user, lessons, progress, moderation)
  data/         Seed content: pillars, lessons, schools, student content
  screens/      One file per screen/route
```

## Routes

- `/`, `/onboarding`, `/login`, `/signup`, `/interests` — auth flow
- `/home`, `/learn`, `/learn/:lessonId`, `/create`, `/create/:type`, `/explore`, `/explore/:contentId`, `/profile`, `/notifications`, `/contributor-application` — student app
- `/admin`, `/sponsor`, `/teacher` — role dashboards (demo access via the sidebar's "Preview Dashboards" section — no real auth yet)

## Deploying to Vercel

This is a static Vite build with client-side routing, already configured with `vercel.json` for SPA rewrites.

```bash
npm run build   # outputs to dist/
```

Either:
1. Push this repo to GitHub and [import it in Vercel](https://vercel.com/new) (framework preset: Vite, auto-detected), or
2. Run `npx vercel` from this directory and follow the prompts.

No environment variables are required yet.
