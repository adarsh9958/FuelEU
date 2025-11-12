# FuelEU

An attractive, developer-friendly dashboard + API platform for Fuel EU Maritime compliance. This repository contains a React frontend and a TypeScript/Express backend that manage route data, compliance balances (CB), banking, and pooling.

---

## Highlights

- Clean React + Vite frontend with Tailwind-based components and charts.
- TypeScript backend with Prisma for local DB and fast test harnesses.
- Pre-wired scripts for development, build, and tests for both frontend and backend.

## Quick snapshot

What you'll find in this repo:

- `Backend/` — API server, Prisma schema + seeds, tests (Jest-like scripts using `tsx`/`ts-node` tooling).
- `frontend/` — Vite + React app (TypeScript) that talks to the backend API.

---

## Tech stack

- Frontend: React, Vite, TypeScript, Tailwind, Recharts
- Backend: Node + Express (TypeScript), Prisma (SQLite for local dev), tsx for running TS directly
- Tests: Vitest (frontend), built-in backend test scripts

## Getting started (Quick)

Requirements

- Node.js (>= 18 recommended)
- npm (or a compatible package manager)

Run the backend and frontend locally (PowerShell examples):

1) Backend (from repo root)

```powershell
cd "Backend"
npm install
# generate prisma client
npm run prisma:generate
# optional: run migrations and seed local DB
npm run prisma:migrate
npm run prisma:seed

# start development server
npm run dev
```

The backend exposes the API endpoints used by the frontend (see `Backend/src/infrastructure/server/index.ts`).

2) Frontend (in a new terminal)

```powershell
cd "frontend"
npm install
npm run dev
```

Open the address printed by Vite (usually http://localhost:5173).

## Scripts (notable)

- Backend
	- `npm run dev` — run backend in watch mode (`tsx watch`)
	- `npm run start` — run backend once
	- `npm run prisma:generate` — generate Prisma client
	- `npm run prisma:migrate` — run migrations (dev)
	- `npm run prisma:seed` — run seeds
	- `npm run test` — run backend tests (test env)

- Frontend
	- `npm run dev` — start local dev server (Vite)
	- `npm run build` — build optimized production assets
	- `npm run test` — run Vitest

## Testing

Backend (PowerShell):

```powershell
cd "Backend"
npm run test
```

Frontend:

```powershell
cd "frontend"
npm run test
```

## Project structure (summary)

- `Backend/` — Express server, Prisma schema under `prisma/`, tests under `tests/`.
- `frontend/` — Vite app; source under `src/` with adapters, core services and UI components.

## Contributing

Contributions are welcome. Suggested flow:

1. Fork the repo
2. Create a feature branch
3. Add or update tests where appropriate
4. Open a pull request describing the change

Please run linters/tests before opening a PR.

## Next steps / tips

- Add a `.env.example` for the backend with required variables.
- Add a short architecture diagram or screenshot for the frontend UI in `README.md` or `public/`.
- Consider adding GitHub Actions for CI (install dependencies and run tests for both frontend and backend).

---

If you'd like, I can:

- add a small screenshot or badge to make the README visually richer,
- add a `.env.example` file and small checklist for running migrations safely,
- or set up a basic GitHub Actions workflow for CI.


---
_Generated and styled README to make onboarding smoother — run the quick start steps above to boot the project locally._

