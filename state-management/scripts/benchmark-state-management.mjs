import { JSDOM } from "jsdom";
import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { create } from "zustand";
import { performance } from "node:perf_hooks";

const { createElement: h, Fragment, Profiler, createContext, useContext, useReducer, useState } = React;
const repetitions = 25;
const warmupRepetitions = 3;
const updatesPerRepetition = 80;
const cartSize = 100;
const productListSize = 8;

const dom = new JSDOM("<!doctype html><html><body></body></html>");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = false;

interfaceSummary();

function interfaceSummary() {
  console.log("Benchmark de render React para Stage 0, Stage 1 y Stage 2");
  console.log("Entorno: React + jsdom; no mide layout, pintura ni interacción de navegador.");
  console.log(`${repetitions} repeticiones medidas, ${warmupRepetitions} de calentamiento, ${updatesPerRepetition} actualizaciones por repetición.`);
}

function addProduct(items, product) {
  const existingItem = items.find((item) => item.id === product.id);
  if (existingItem) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item,
    );
  }
  return [...items, { ...product, quantity: 1 }];
}

function updateQuantity(items, productId, quantity) {
  return items.map((item) =>
    item.id === productId ? { ...item, quantity } : item,
  );
}

function createProducts(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `product-${index}`,
    name: `Product ${index}`,
    price: 10 + index,
  }));
}

function createLocalApp(scenario, counters, assignUpdate) {
  const products = createProducts(productListSize);
  const cartItems = createProducts(cartSize).map((product) => ({ ...product, quantity: 1 }));
  const updatedProduct = products[0];
  let nextQuantity = 2;
  const getNextQuantity = () => {
    const quantity = nextQuantity;
    nextQuantity = nextQuantity === 99 ? 2 : nextQuantity + 1;
    return quantity;
  };

  function Layout({ items }) {
    counters.layout++;
    const count = items.reduce((total, item) => total + item.quantity, 0);
    return h("header", null, count);
  }

  function ProductCard({ product }) {
    counters.productCards++;
    return h("button", { type: "button" }, product.name);
  }

  function ProductList({ onAddProduct }) {
    counters.productList++;
    return h("section", null, products.map((product) =>
      h(ProductCard, { key: product.id, product, onAddProduct }),
    ));
  }

  function CartRow({ item }) {
    counters.cartRows++;
    return h("li", null, item.name, " ", item.quantity);
  }

  function CartContents({ items }) {
    counters.cartContents++;
    return h("ul", null, items.map((item) => h(CartRow, { key: item.id, item })));
  }

  function CartPage({ items }) {
    counters.cartPage++;
    return h(CartContents, { items });
  }

  return function App() {
    counters.app++;
    const [items, setItems] = useState(scenario === "products" ? [] : cartItems);
    const update = scenario === "products"
      ? () => setItems((current) => addProduct(current, updatedProduct))
      : () => setItems((current) => updateQuantity(current, "product-0", getNextQuantity()));
    assignUpdate(update);
    return h(Fragment, null,
      h(Layout, { items }),
      scenario === "products"
        ? h(ProductList, { onAddProduct: update })
        : h(CartPage, { items }),
    );
  };
}

function createContextApp(scenario, counters, assignUpdate) {
  const CartContext = createContext(null);
  const products = createProducts(productListSize);
  const initialItems = createProducts(cartSize).map((product) => ({ ...product, quantity: 1 }));
  const updatedProduct = products[0];
  let nextQuantity = 2;
  const getNextQuantity = () => {
    const quantity = nextQuantity;
    nextQuantity = nextQuantity === 99 ? 2 : nextQuantity + 1;
    return quantity;
  };

  function reducer(items, action) {
    if (action.type === "product-added") return addProduct(items, action.product);
    return updateQuantity(items, action.productId, action.quantity);
  }

  function Provider({ children }) {
    counters.provider++;
    const [items, dispatch] = useReducer(reducer, scenario === "products" ? [] : initialItems);
    const add = (product) => dispatch({ type: "product-added", product });
    const update = (productId, quantity) => dispatch({ type: "quantity-updated", productId, quantity });
    const value = { items, add, update };
    assignUpdate(scenario === "products"
      ? () => add(updatedProduct)
      : () => update("product-0", getNextQuantity()));
    return h(CartContext.Provider, { value }, children);
  }

  function Layout() {
    counters.layout++;
    const { items } = useContext(CartContext);
    return h("header", null, items.reduce((total, item) => total + item.quantity, 0));
  }

  function ProductCard({ product }) {
    counters.productCards++;
    return h("button", { type: "button" }, product.name);
  }

  function ProductList() {
    counters.productList++;
    const { add } = useContext(CartContext);
    return h("section", null, products.map((product) =>
      h(ProductCard, { key: product.id, product, onAddProduct: add }),
    ));
  }

  function CartRow({ item }) {
    counters.cartRows++;
    return h("li", null, item.name, " ", item.quantity);
  }

  function CartContents({ items }) {
    counters.cartContents++;
    return h("ul", null, items.map((item) => h(CartRow, { key: item.id, item })));
  }

  function CartPage() {
    counters.cartPage++;
    const { items } = useContext(CartContext);
    return h(CartContents, { items });
  }

  return function App() {
    counters.app++;
    return h(Provider, null,
      h(Fragment, null,
        h(Layout),
        scenario === "products" ? h(ProductList) : h(CartPage),
      ),
    );
  };
}

function createZustandApp(scenario, counters, assignUpdate) {
  const products = createProducts(productListSize);
  const initialItems = createProducts(cartSize).map((product) => ({ ...product, quantity: 1 }));
  const updatedProduct = products[0];
  let nextQuantity = 2;
  const getNextQuantity = () => {
    const quantity = nextQuantity;
    nextQuantity = nextQuantity === 99 ? 2 : nextQuantity + 1;
    return quantity;
  };
  const store = create((set) => ({
    items: scenario === "products" ? [] : initialItems,
    addProduct: (product) => set((state) => ({ items: addProduct(state.items, product) })),
    updateQuantity: (productId, quantity) =>
      set((state) => ({ items: updateQuantity(state.items, productId, quantity) })),
  }));
  assignUpdate(scenario === "products"
    ? () => store.getState().addProduct(updatedProduct)
    : () => store.getState().updateQuantity("product-0", getNextQuantity()));

  function Layout() {
    counters.layout++;
    const count = store((state) => state.items.reduce((total, item) => total + item.quantity, 0));
    return h("header", null, count);
  }

  function ProductCard({ product }) {
    counters.productCards++;
    return h("button", { type: "button" }, product.name);
  }

  function ProductList() {
    counters.productList++;
    const add = store((state) => state.addProduct);
    return h("section", null, products.map((product) =>
      h(ProductCard, { key: product.id, product, onAddProduct: add }),
    ));
  }

  function CartRow({ item }) {
    counters.cartRows++;
    return h("li", null, item.name, " ", item.quantity);
  }

  function CartContents({ items }) {
    counters.cartContents++;
    return h("ul", null, items.map((item) => h(CartRow, { key: item.id, item })));
  }

  function CartPage() {
    counters.cartPage++;
    const items = store((state) => state.items);
    return h(CartContents, { items });
  }

  return function App() {
    counters.app++;
    return h(Fragment, null,
      h(Layout),
      scenario === "products" ? h(ProductList) : h(CartPage),
    );
  };
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

async function measure(stage, scenario) {
  const samples = [];
  let finalRenderCounts = null;
  for (let repetition = 0; repetition < repetitions + warmupRepetitions; repetition++) {
    const counters = {
      app: 0,
      provider: 0,
      layout: 0,
      productList: 0,
      productCards: 0,
      cartPage: 0,
      cartContents: 0,
      cartRows: 0,
      actualDuration: 0,
      commits: 0,
      onRender(_id, phase, duration) {
        if (phase === "update") {
          counters.actualDuration += duration;
          counters.commits++;
        }
      },
    };
    let update = () => {};
    const assignUpdate = (callback) => { update = callback; };
    const App = stage === "Stage 0"
      ? createLocalApp(scenario, counters, assignUpdate)
      : stage === "Stage 1"
        ? createContextApp(scenario, counters, assignUpdate)
        : createZustandApp(scenario, counters, assignUpdate);
    const container = document.createElement("div");
    const root = createRoot(container);
    flushSync(() => root.render(h(Profiler, { id: "app", onRender: counters.onRender }, h(App))));
    const initialCounts = { ...counters };
    const startedAt = performance.now();
    for (let index = 0; index < updatesPerRepetition; index++) {
      flushSync(() => update());
    }
    const elapsed = performance.now() - startedAt;
    const result = {
      elapsedPerActionMs: elapsed / updatesPerRepetition,
      profilerPerActionMs: counters.actualDuration / updatesPerRepetition,
      commitsPerAction: counters.commits / updatesPerRepetition,
      rendersPerAction: Object.fromEntries(
        Object.keys(initialCounts)
          .filter((key) => ["app", "provider", "layout", "productList", "productCards", "cartPage", "cartContents", "cartRows"].includes(key))
          .map((key) => [key, (counters[key] - initialCounts[key]) / updatesPerRepetition]),
      ),
    };
    root.unmount();
    if (repetition >= warmupRepetitions) samples.push(result);
    finalRenderCounts = result.rendersPerAction;
  }
  const elapsedSamples = samples.map((sample) => sample.elapsedPerActionMs);
  const profilerSamples = samples.map((sample) => sample.profilerPerActionMs);
  return {
    stage,
    scenario,
    medianElapsedPerActionMs: +median(elapsedSamples).toFixed(4),
    medianProfilerPerActionMs: +median(profilerSamples).toFixed(4),
    p95ProfilerPerActionMs: +[...profilerSamples].sort((a, b) => a - b)[Math.floor(profilerSamples.length * 0.95)].toFixed(4),
    commitsPerAction: samples[0].commitsPerAction,
    rendersPerAction: finalRenderCounts,
  };
}

const results = [];
for (const scenario of ["products", "cart"]) {
  for (const stage of ["Stage 0", "Stage 1", "Stage 2"]) {
    results.push(await measure(stage, scenario));
  }
}

console.log(JSON.stringify({
  settings: { repetitions, warmupRepetitions, updatesPerRepetition, productListSize, cartSize },
  results,
}, null, 2));
