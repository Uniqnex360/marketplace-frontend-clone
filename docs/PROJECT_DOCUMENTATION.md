# MarketLink Frontend — Project Documentation

## Table of Contents
- Project Overview
- Quick Start
- Requirements
- Installation
- Development Workflow (scripts)
- Project Structure (file map)
- Key Files & Components
- Utilities, Providers & Hooks
- Routing, Layout & Theming
- Public assets
- Environment variables & API
- Testing & Debugging
- Deployment (Vercel)
- Contribution & PR guidelines
- Troubleshooting & FAQ

---

## Project Overview

MarketLink Frontend is a React application (Create React App) that provides a unified UI for aggregating and visualizing marketplace data across channels such as Amazon, Walmart, TikTok Shop and eBay. The frontend integrates with backend services through REST endpoints and renders dashboards, reports, product/inventory pages and user management screens.

This documentation explains how to set up, develop, test, and deploy the frontend, and describes the important files and components in the codebase.

## Quick Start

1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Open the app at `http://localhost:3000`

## Requirements

- Node.js (LTS recommended; Node >= 16 or 18+) and `npm`
- A backend API accessible via environment variable `REACT_APP_IP` (see Environment variables section)

## Installation

1. Clone the repository.
2. From the project root, run:

```
npm install
```

## Development Workflow (scripts)

The `package.json` in this project contains the standard Create React App scripts:

- `npm start` — run the app in development mode with hot reload.
- `npm run build` — create an optimized production build in the `build/` folder.
- `npm test` — run test runner (Jest + React Testing Library).
- `npm run eject` — eject CRA configuration (irreversible).

Use `npm start` during development and `npm run build` for deployable artifacts.

## Project Structure

High-level project layout (see `docs/PROJECT_STRUCTURE.txt` for a snapshot):

- `public/` — static assets and `index.html`.
- `src/` — application source code.
  - `App.js`, `index.js`, `routes.js`, `Layout.js`, `Theme.js` — app entry and layout.
  - `Components/` — React components grouped by feature (Client-Admin, MarketLogin, Loading, TheameContext).
  - `utils/` — utilities, providers and hooks.
- `docs/` — documentation (this file and supporting docs).
- `package.json` — dependencies and scripts.
- `vercel.json` — Vercel deployment configuration.

### Notable source files

- `src/index.js` — React entry point; mounts the app and any providers.
- `src/App.js` — top-level component that configures routes and global providers.
- `src/routes.js` — central routing definitions; wired to `react-router-dom`.
- `src/Layout.js` — layout wrapper used across pages.
- `src/Theme.js` — theme and global UI config (MUI integration).

## Key Files & Components (overview)

This section highlights major folders and representative files.

- `src/Components/MarketLogin/` — login, register and password reset screens.
  - `LoginPage.js` — handles authentication form and calls backend `signup`/`login` endpoints using `axios`.
  - `Register.js` — user registration flow.
  - `ForgotPassword.js` — forgot/change password flows.

- `src/Components/Client-Admin/` — dashboard, products, orders, inventory and settings screens targeted at client administrations.
  - `Dashboard/` — a collection of charts and KPI components (RevenueGraph, TotalSalesGraph, DonutChart, etc.).
  - `Products/` — product listing, import and detail pages.
  - `Orders/` — order list and detail views.
  - `Inventory/` — inventory channel and list UI.

- `src/Components/TheameContext/` — theme and text context handlers.
  - `TheameContext.js` — theme provider and storage of theme preferences.
  - `TextContext.js` — a context for UI text or i18n (if used).

- `src/Components/Loading/` — reusable loading indicators (e.g., `DotLoading.js`).

## Utilities, Providers & Hooks

Most application logic that is reused lives under `src/utils/`.

- `MarketplaceProvider.js` — likely a React context/provider that supplies marketplace-related data.
- `marketplace.js` — small API wrapper that uses `axios` and `process.env.REACT_APP_IP` to fetch marketplace lists. Example function: `fetchMarketplaceList(userId, source, country)`.
- `currencyFormatter.js`, `currencySymbol.js` — utilities for currency formatting.
- `UseEnhancedCategories.js`, `useMetrics.js`, `SalesTrends.js` — domain helpers for charts and data preparation.

Inspect individual files in `src/utils/` for exact function signatures.

## Routing, Layout & Theming

- Routing is implemented with `react-router-dom` (v7). See `src/routes.js` for route definitions.
- `src/Layout.js` provides top-level layout, sidebars and header.
- The app uses Material UI (MUI) components and icons; `src/Theme.js` contains MUI theme configuration.

## Public assets

- `public/index.html` — HTML template.
- `public/manifest.json` and `public/robots.txt` — PWA and crawling configuration.

## Environment variables & API

This frontend expects at least the following environment variables (Create React App format — `.env` files or CI env):

- `REACT_APP_IP` — base URL for backend API endpoints (used throughout the code, e.g., `process.env.REACT_APP_IP + 'signupUser/'`).

Create a `.env` file in the project root for local development (not committed):

```
REACT_APP_IP=https://api.example.com/
```

Notes:
- Many files call endpoints by concatenating `process.env.REACT_APP_IP` with path segments such as `signupUser/`, `forgotPassword/`, `getMarketplaceList/` etc. Confirm the backend API routes with backend team or developer docs.

## Testing & Debugging

- Unit / integration test runner uses Create React App defaults (Jest + React Testing Library). Use:

```
npm test
```

- For debugging in the browser, open DevTools. The app runs on `http://localhost:3000` by default.

## Deployment (Vercel)

This project includes a `vercel.json` which configures the Vercel deployment. Typical steps:

1. Push branch to remote Git provider (GitHub, GitLab, etc.).
2. Create a Vercel project linking the repository.
3. Add `REACT_APP_IP` and any other env vars in Vercel's Environment Variables dashboard.
4. Vercel will run `npm run build` to create the production build.

## Contribution & PR Guidelines

- Create a topic branch from `dev` for features/bugfixes.
- Run `npm install` and start locally to reproduce issues.
- Add or update unit tests where appropriate.
- Open a PR to `dev` with a clear description and screenshots when applicable.

Suggested PR checklist:

- Code compiles and lints (where lint is configured).
- No console errors in dev build.
- Tests covering new behavior added or updated.
- Update documentation if public API or behavior changed.

## Troubleshooting & FAQ

- App fails to connect to API: ensure `REACT_APP_IP` is set and reachable from your machine.
- Port in use: CRA defaults to 3000; set `PORT` env var if needed.
- Unexpected CORS errors: backend must allow requests from your origin.

If you encounter issues that aren't answered here, open an issue or contact the maintainer.

---

## Where to look next (developer pointers)

- Start at `src/index.js` to learn how providers and `App` are mounted.
- Inspect `src/routes.js` for all app routes and any route-level guards (e.g., `PrivateRoute` in `Components/MarketLogin/PrivateRoute.js`).
- Explore `src/Components/Client-Admin/Dashboard/` for common charting and data visualization patterns (Highcharts, Recharts usage).

---

This documentation should be kept in sync with code. When adding new features, update the relevant section.
