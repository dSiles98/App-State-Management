# Application State Management Demo

A small React shopping app for studying shared application state. The current implementation is Stage 2: Zustand stores the cart and components select the state/actions they need, while pure domain operations remain independent of React. Stages 0 (`LocalReactState`) and 1 (Context API and `useReducer`) are retained as historical documentation.

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

`App.tsx` composes the router and layout. The Zustand store lives in `features/cart/state/cartStore.ts`; pages and list components select values from `useCartStore`. `ProductCard` and `CartItemRow` remain presentational components. Pure cart transformations live in `features/cart/domain/cartOperations.ts`.

See [the architecture guide](state-management/docs/ARCHITECTURE.md) for Stage 0 and Stage 1 historical records, the Stage 2 implementation, trade-offs, and detailed comparisons. [State management stages](state-management/docs/STATE_MANAGEMENT_STAGES.md) summarizes the current stage and the testing/demo walkthrough.
