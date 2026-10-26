# State Management Stages

## Stage 0: LocalReactState

The application currently uses local React state and prop drilling. `App.tsx` owns the cart with `useState`, defines the add, remove, and quantity callbacks, and passes cart values and callbacks down to the route components. The catalog page and cart page share the same state because both are rendered below `App` and the router.

There is no `CartContext`, cart reducer, `useCart` hook, Zustand store, or Zustand hook in the current source. The detailed current flow, behavior, and drawbacks are in [ARCHITECTURE.md](ARCHITECTURE.md).

The next stages below are plans only. Implement each stage later in its own commit so the history can be used as a teaching sequence.

## Stage 1: Context API and `useReducer` (Planned Commit A)

### Goal

Move cart state and transitions into a reducer and expose them through Context. This removes the need for cart-only intermediate components to forward state and callbacks, while keeping state transitions explicit.

### Expected files

- Add `src/features/cart/state/cartReducer.ts` for the state type, action type, initial state, and reducer.
- Add `src/features/cart/state/CartContext.tsx` for the context and provider.
- Add `src/features/cart/state/useCart.ts` for the typed consumer hook.
- Update `src/App.tsx` to mount the provider and remove its cart `useState` and handlers.
- Update cart/product component boundaries to consume the hook where state is needed and remove obsolete forwarding props.
- Add reducer and provider tests; update component/integration tests as needed.

### Suggested sequence

1. Define typed actions for adding, removing, and setting a quantity.
2. Implement reducer cases by calling the existing pure functions in `cartOperations.ts`.
3. Create the Context value and provider using `useReducer`.
4. Add a `useCart` hook that gives a clear error if used outside the provider.
5. Mount the provider around the routes and migrate consumers.
6. Remove only the props that became unnecessary; keep props that describe presentational data.
7. Run lint, typecheck, tests, and build.

### Reuse and tests

Keep `Product`, `CartItem`, `CartUpdateResult`, `addProduct`, `removeProduct`, `updateProductQuantity`, `calculateSubtotal`, the repository, currency formatter, and most visual components. The domain rules should remain outside React.

Existing domain tests and visible behavior for adding, removing, changing quantity, subtotal, and the empty cart should continue to pass. Add tests for each reducer action, initial state, the quantity cap, and using the hook outside its provider. Keep accessible-role component tests and add an integrated provider-to-UI test.

### Suggested commit message

`feat: move cart state to context and reducer`

## Stage 2: Zustand (Planned Commit B)

### Goal

Replace the Context/reducer mechanism with a Zustand store and selector-based hook. This demonstrates an external store with a small API and compares direct store subscriptions with Context and `useReducer` from Stage 1.

### Expected files

- Add the `zustand` dependency.
- Add `src/features/cart/state/cartStore.ts` to create the typed cart store with `create`.
- Add a typed `useCartStore` hook or export the store hook from `cartStore.ts`.
- Update cart/product consumer boundaries to select cart values and actions from the store.
- Remove the Context, reducer, and `useCart` files created in Commit A.
- Add store-action and selector tests and retain integration tests for the UI behavior.

### Suggested sequence

1. Install Zustand.
2. Create a cart store whose actions delegate business rules to `cartOperations.ts`.
3. Define the store state and action types from the cart domain types.
4. Add selector-based subscriptions for cart items, item count, and actions.
5. Migrate consumers from the Context hook to the Zustand store hook; no provider is required.
6. Replace Commit A-specific tests with store-action and store-to-UI integration tests.
7. Remove files used only by Commit A and run lint, typecheck, tests, and build.

### Reuse and tests

Keep the domain types and pure operations, the local catalog, currency formatting, routes, and visual components. Zustand replaces the state access mechanism; the store should not absorb the cart's business rules.

Domain tests and the visible behaviors from Stage 0 should continue to pass. Add tests for store actions, selectors, initial store state, and integrated updates to the header count, subtotal, quantity, item removal, and empty state.

### Suggested commit message

`feat: migrate cart state to zustand`
