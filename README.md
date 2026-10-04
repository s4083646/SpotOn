# Study Spot Finder

A mobile-first web app that helps students find great study spots around Melbourne: personalised picks, a real map, student reviews and live "vibe" updates, plus a Study Buddy that levels up as you study.

Built with React 19, TypeScript, Vite and Tailwind CSS v4. Originally designed in Figma Make.

## Requirements

- Node.js 22 or newer
- pnpm 10

## Run locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173.

## Production build

```bash
pnpm build     # type-checks, then builds to dist/
pnpm preview
```

## External services and assets

No API keys or environment variables are required.

- Map: Leaflet + OpenStreetMap tiles (keep the attribution visible; use a tile provider for high-traffic production use)
- Font: DM Sans from Google Fonts
- Venue photos: Unsplash
- Directions: Apple Maps on iPhone/iPad, Google Maps elsewhere

## Data and storage

This is a frontend-only MVP. Everything is stored in the browser's localStorage (keys start with `study-spot:`):

- `accounts`, `session`: sign-up/login (passwords are hashed, but this is not real security)
- `user-data:<id>`: study profile, saved spots, sessions, XP spending, Study Buddy cosmetics, helpful votes, reminder settings
- `community`: reviews and vibe updates written in the app (shared by accounts on the same browser)
- `location`: the selected area

Spot details, opening hours, ratings, sample reviews and typical conditions are sample data in `src/data/`.
To move to a real backend (e.g. Supabase), replace the functions in `src/services/`.
