# Application State Management Demo

A small React shopping app for studying shared application state. The current implementation is Stage 1: the cart uses Context and `useReducer`, while pure domain operations remain independent of React. Stage 0, `LocalReactState`, is retained as historical documentation; Stage 2 (Zustand) is future work.

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

`App.tsx` composes `CartProvider` around the layout and routes. The provider owns the reducer and exposes a typed `useCart` hook. Pages and list components consume the context where needed; `ProductCard` and `CartItemRow` remain presentational components. Pure cart transformations live in `features/cart/domain/cartOperations.ts`.

See [the architecture guide](state-management/docs/ARCHITECTURE.md) for the Stage 0 historical record, Stage 1 implementation, trade-offs, and comparison with Zustand. [State management stages](state-management/docs/STATE_MANAGEMENT_STAGES.md) describes the implemented Stage 1 and planned Stage 2.
