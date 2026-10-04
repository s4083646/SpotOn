# Study Spot Finder

React 19 + TypeScript + Vite + Tailwind CSS v4 mobile-first web app for finding study spots in Melbourne.
Originally generated in Figma Make; now a standard local Vite project.

## Commands

- `pnpm install` – install dependencies
- `pnpm dev` – start the dev server (http://localhost:5173)
- `pnpm typecheck` – TypeScript check
- `pnpm build` – type-check and build to `dist/`
- `pnpm preview` – serve the production build

## Project structure

- `src/App.tsx` – app shell: tab state, modals and wiring between pages
- `src/pages/` – Explore, Map, Saved and Profile tabs
- `src/components/` – UI building blocks (cards, sheets/modals, map, auth/signup, etc.)
- `src/data/` – sample study spots, study-profile options, and sample community data (reviews, cosmetics, vibe options)
- `src/types/` – `spot.ts` and `user.ts` data models
- `src/services/` – `auth.ts`, `userData.ts` and `community.ts`; the only code that knows data lives in localStorage. Replace these to move to Supabase or another backend.
- `src/hooks/` – `useAccount` (signed-in user + per-user data, XP, cosmetics), `useCommunity` (reviews, ratings, vibe updates), `useNow`
- `src/utils/` – storage helpers, spot filtering/opening hours, recommendations scoring, XP/streak/badges (`progress.ts`), geolocation, validation

## Notes

- Map: Leaflet + react-leaflet with OpenStreetMap tiles (no API key). Keep the OSM attribution visible.
- Spot noise/crowd/seat values are sample data, not live; label them as such in the UI.
- Styling uses Tailwind utility classes in JSX; global CSS, animations and Leaflet pin styles live in `src/index.css`.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings.
- Export components as default exports.
- Keep TypeScript strict; run `pnpm build` after changes.
