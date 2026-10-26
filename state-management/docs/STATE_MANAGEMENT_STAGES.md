# Etapas de gestión del estado

## Stage 0: LocalReactState — etapa histórica

Stage 0 fue la base para mostrar el problema del prop drilling. `App.tsx` mantenía el carrito con `useState`, definía las acciones y pasaba datos y callbacks a través de páginas y componentes intermedios.

Sus ventajas eran la sencillez, la visibilidad de una única fuente de verdad y el uso de funciones puras fáciles de probar. Su costo principal era el cableado de props, además de la pérdida del carrito al refrescar y los renders amplios. El registro completo de ventajas y desventajas permanece en [ARCHITECTURE.md](ARCHITECTURE.md).

Stage 0 ya no describe el código actual: queda aquí como referencia histórica para la demo.

## Stage 1: Context API y `useReducer` — implementado

### Objetivo

Reducir el prop drilling de estado compartido y hacer explícitas las transiciones del carrito mediante acciones tipadas. El estado sigue en memoria y las reglas del negocio siguen fuera de React.

### Implementación actual

- `src/features/cart/state/cartReducer.ts` define `CartState`, las acciones, el estado inicial y el reducer.
- `src/features/cart/state/CartContext.tsx` crea `CartProvider`, invoca `useReducer` y expone datos y acciones.
- `src/features/cart/state/useCart.ts` proporciona acceso tipado y valida que el consumidor esté dentro del provider.
- `src/App.tsx` compone `BrowserRouter`, `CartProvider`, layout y rutas; no es dueño del estado del carrito.
- `src/app/layout/AppLayout.tsx`, `src/features/products/components/ProductList.tsx`, `src/features/cart/pages/CartPage.tsx` y `src/features/cart/components/CartContents.tsx` consumen el hook donde necesitan datos o acciones.
- `src/features/cart/domain/cartOperations.ts` conserva las funciones puras de agregar, quitar, cambiar cantidades y calcular el subtotal.
- `ProductCard` y `CartItemRow` permanecen como vistas de presentación y reciben sus datos/acciones por props.

### Flujo de una acción

1. Un consumidor obtiene una función del contexto con `useCart`.
2. La función despacha una acción discriminada, por ejemplo `productAdded` o `quantityUpdated`.
3. `cartReducer` resuelve la acción llamando a la operación pura apropiada.
4. El reducer devuelve un nuevo `CartState`; React actualiza el provider.
5. Los componentes suscritos al mismo Context vuelven a renderizar con el nuevo valor.

### Pruebas

- `cartOperations.test.ts`: reglas puras del dominio.
- `cartReducer.test.ts`: estado inicial, acciones, inmutabilidad, límites y producto inexistente.
- `useCart.test.tsx`: error al consumir el hook fuera del provider.
- `CartPage.test.tsx`: agrega con el provider, cambia la cantidad, verifica el subtotal y quita el producto.
- `ProductCard.test.tsx`: acción accesible del componente de presentación.

### Límites que siguen vigentes

Context no persiste el carrito. El valor compartido se reconstruye en el render del provider y todos los componentes consumidores observan ese mismo valor. Los mensajes devueltos por el dominio no se presentan en la UI, y vaciar el campo de cantidad todavía equivale a cantidad cero y quita el producto. Esta etapa no incluye separación de contextos, memoización ni optimización de renders.

## Stage 2: Zustand — planificado

Stage 2 reemplazará la solución de Context/reducer de Stage 1 por Zustand para comparar el acceso a un store externo basado en selectores. Todavía no se ha instalado Zustand ni existe su store en el código.

### Archivos y cambios previstos

- Instalar la dependencia `zustand`.
- Crear `src/features/cart/state/cartStore.ts` para definir el store tipado con `create`.
- Definir acciones del store que deleguen las reglas a `cartOperations.ts`.
- Migrar los consumidores de `useCart` a selectores del store de Zustand.
- Retirar `CartProvider`, `CartContext`, `cartReducer` y el hook de Context de Stage 1.
- Añadir pruebas de acciones, selectores y recorrido integrado.

### Pasos sugeridos

1. Instalar Zustand en su propio commit de etapa.
2. Crear el store con estado y acciones tipadas.
3. Mantener las funciones del dominio como fuente única de reglas.
4. Migrar consumidores usando selectores pequeños para los valores que cada uno necesita.
5. Quitar el provider y los módulos exclusivos de Stage 1.
6. Repetir los mismos casos de UI y de dominio de las etapas anteriores.
7. Ejecutar lint, typecheck, pruebas y build.

### Reutilización y pruebas

Se deben conservar tipos de dominio, funciones puras, catálogo, rutas, formato monetario y componentes de presentación. Las pruebas de operaciones y los comportamientos visibles de Stage 1 deben continuar pasando. Añadir pruebas para el estado inicial del store, cada acción, cada selector y los cambios integrados en contador, subtotal, cantidad, eliminación y carrito vacío.

### Commit sugerido

`feat: migrate cart state to zustand`

## Comparación al completar Stage 2

Para preparar la explicación desde cada punto de vista, consulta las tablas detalladas de [Stage 0 frente a Stage 1 y Stage 2](ARCHITECTURE.md#comparacion-desde-stage-0-localreactstate) y de [Stage 1 frente a Stage 0 y Stage 2](ARCHITECTURE.md#comparacion-desde-stage-1-context-api-y-usereducer), junto con sus guiones para exponer.

La comparación detallada está en [ARCHITECTURE.md](ARCHITECTURE.md). Stage 0 muestra el costo del prop drilling; Stage 1 muestra Context y acciones explícitas; Stage 2 permitirá observar Zustand con selectores. Conviene repetir el mismo recorrido y las mismas pruebas para evaluar claridad, acoplamiento, facilidad de test y renders antes de decidir qué enfoque conviene explicar como solución preferida.
