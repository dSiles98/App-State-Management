# Application State Management Demo

A small React shopping app for studying shared application state. The current implementation is Stage 0, `LocalReactState`: `App` owns the cart with `useState`, and pages and nested components receive cart values and callbacks through props. Stage 1 (Context API and `useReducer`) and Stage 2 (Zustand) are future stages and are not part of the current app.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

From `state-management/`:

```bash
npm install
npm run dev
```

Open `/` to browse the local catalog and `/cart` to inspect the shared cart.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Type-checks and creates a production build. |
| `npm run preview` | Serves the production build locally. |
| `npm run lint` | Runs ESLint and treats warnings as errors. |
| `npm run format` | Formats project files with Prettier. |
| `npm run typecheck` | Runs the TypeScript project checks. |
| `npm run test` | Runs unit and component tests with Vitest. |

## Project layout

```text
state-management/
  src/
    app/                  App composition and layout
    features/
      cart/               Cart types, pure operations, components, and page
      products/           Local catalog, product components, and page
    shared/               Shared navigation and currency formatting
    test/                 Test setup
  docs/
    ARCHITECTURE.md       Current implementation and its trade-offs
    STATE_MANAGEMENT_STAGES.md
```

## Current state flow

`App.tsx` stores the cart in React local state. It passes product actions through `ProductPage`, `ProductList`, and `ProductCard`. Cart items and callbacks pass through `CartPage`, `CartContents`, and `CartItemRow`. The header count follows `AppLayout`, `SiteHeader`, and `CartLink`. Pure cart transformations live in `features/cart/domain/cartOperations.ts`.

See [the architecture guide](state-management/docs/ARCHITECTURE.md) for the full data flow and current limitations. [Future state management stages](state-management/docs/STATE_MANAGEMENT_STAGES.md) describes planned Stage 1 and Stage 2; neither stage has been implemented yet.
