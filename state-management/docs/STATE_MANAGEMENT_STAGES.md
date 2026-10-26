# Etapas de gestión del estado

## Stage 0: LocalReactState — histórico

Stage 0 fue la primera base didáctica. `App.tsx` tenía el carrito en `useState`, definía las acciones y pasaba datos/callbacks por páginas y componentes intermedios. La ventaja era mostrar con claridad el prop drilling usando solo React; el costo era el cableado y la concentración de actualizaciones en `App`.

Stage 0 ya no describe el código actual. Su comportamiento, ventajas y desventajas se conservan en [ARCHITECTURE.md](ARCHITECTURE.md).

## Stage 1: Context API y `useReducer` — histórico

Stage 1 movió el estado a `CartProvider`, utilizó acciones tipadas con `useReducer` y dio acceso mediante `useCart`. Redujo el paso de props desde `App` y mantuvo las operaciones puras. El costo era que cada consumidor necesitaba el provider y que todos los consumidores compartían el valor de un único Context.

La migración a Stage 2 quitó `CartContext`, `cartReducer`, `useCart` y sus pruebas de la aplicación actual. Se conservan en la documentación como registro conceptual de la etapa.

## Stage 2: Zustand — implementación actual

### Store y consumidores

- `src/features/cart/state/cartStore.ts` define `CartStore` y crea `useCartStore` con `create` de Zustand.
- El store contiene `cartItems` y las acciones `addProduct`, `removeProduct` y `updateProductQuantity`.
- Cada acción delega las reglas del carrito a `src/features/cart/domain/cartOperations.ts` y guarda el resultado inmutablemente.
- `src/App.tsx` compone router, layout y rutas; no contiene estado del carrito y no monta un provider de Zustand.
- `AppLayout`, `ProductList`, `CartPage` y `CartContents` consumen el store con selectores.
- `ProductCard` y `CartItemRow` son vistas de presentación que reciben sus datos y callbacks por props.

### Recorrido de una actualización

1. Un componente obtiene un valor o una acción usando un selector de `useCartStore`.
2. El usuario activa una acción, por ejemplo agregar un producto o cambiar su cantidad.
3. La acción del store llama a una función pura de `cartOperations.ts`.
4. Zustand recibe un nuevo array mediante `set`; los artículos previos no se mutan.
5. Los componentes cuyas selecciones cambian reciben una actualización.

El contador de unidades y el subtotal se derivan durante el render. No se almacenan como estado adicional. No se usa `useEffect`, persistencia, middleware ni memoización.

### Casos cubiertos

- Carrito inicial vacío y subtotal cero.
- Producto nuevo con cantidad uno y adiciones repetidas.
- Eliminación por ID.
- Mínimo, máximo de 99 y producto inexistente.
- Flujo del carrito conectado al store: agregar, cambiar cantidad, actualizar subtotal y quitar.

### Trade-offs de la etapa

- Ya no hay provider React ni que llevar estado global desde `App` por el árbol.
- Los selectores permiten suscripciones específicas; el microbenchmark muestra menos renders de productos, pero no una mejora general para todas las pantallas.
- El store crea una dependencia externa y sus consumidores importan directamente el módulo de Zustand.
- La instancia vive al nivel del módulo; no se configuró para stores aislados, SSR ni múltiples instancias de la aplicación.
- Los selectores que construyen objetos o arrays nuevos pueden producir renders adicionales si no se usa una igualdad apropiada.
- El carrito sigue siendo temporal: un refresco lo reinicia.
- Los mensajes de `CartUpdateResult` no se presentan; limpiar el input de cantidad sigue quitando el producto.

## Archivos clave para estudiar cada enfoque

Stage 0 y Stage 1 son registros históricos: algunos archivos de esas implementaciones ya no existen en el árbol actual. Los nombres siguientes identifican los puntos que conviene explicar; Stage 2 corresponde al código vigente.

### Stage 0: LocalReactState

- **`src/App.tsx`, versión de Stage 0:** `useState`, handlers y dueño del carrito. Hoy `App.tsx` ya no contiene ese estado.
- **`ProductPage.tsx` y `ProductList.tsx`, versiones de Stage 0:** recorrido de productos y callbacks por props.
- **`CartPage.tsx` y `CartContents.tsx`, versiones de Stage 0:** recorrido de artículos y acciones hacia las filas.
- **`ProductCard.tsx` y `CartItemRow.tsx`:** controles que disparan acciones; hoy conservan una interfaz presentacional.
- **`cartOperations.ts`:** reglas puras reutilizadas también en las otras etapas.

### Stage 1: Context API y `useReducer`

- **`src/features/cart/state/CartContext.tsx`, histórico:** provider y puente entre React y reducer.
- **`cartReducer.ts`, histórico:** acciones discriminadas y transiciones delegadas al dominio.
- **`useCart.ts`, histórico:** acceso tipado al Context y verificación del provider.
- **`cartReducer.test.ts` y `useCart.test.tsx`, históricos:** pruebas de transiciones y del hook bajo/sin provider.
- **`cartOperations.ts`:** las mismas reglas puras, sin acoplarlas al reducer.

Estos módulos fueron retirados al migrar a Stage 2. Si se guardaron commits de las etapas anteriores, se pueden consultar allí; el árbol actual conserva su explicación documental.

### Stage 2: Zustand, implementación vigente

- **`src/features/cart/state/cartStore.ts`:** tipo del store, creación con Zustand y acciones.
- **`AppLayout.tsx`:** selector del contador de unidades.
- **`ProductList.tsx`:** selector de la acción `addProduct`.
- **`CartPage.tsx`:** selector de `cartItems`.
- **`CartContents.tsx`:** selectores de acciones y subtotal derivado.
- **`cartOperations.ts`:** reglas puras que el store reutiliza.
- **`cartStore.test.ts` y `CartPage.test.tsx`:** pruebas de acciones/límites y recorrido integrado del carrito.
- **`package.json`:** dependencia `zustand`.

## Recomendación final

Para esta aplicación, el ganador recomendado es **Stage 2: Zustand**: resuelve el estado compartido entre rutas con un store pequeño, permite seleccionar el dato o acción necesario y evita el provider obligatorio de Stage 1. Mantiene las reglas en funciones puras y deja las vistas de producto y fila como componentes de presentación.

La elección depende del objetivo. Stage 0 sirve mejor para enseñar el problema; Stage 1 es buena opción si se priorizan las APIs nativas de React y evitar dependencias externas; Stage 2 encaja mejor con la implementación final de esta demo. El microbenchmark encontró una ventaja de renders en la ruta de productos, pero no una mejora universal: en el escenario de carrito con 100 filas, Stage 2 tuvo una mediana mayor que Stage 0 y Stage 1. La recomendación considera el encaje y costo de integración además de esa medición limitada. Si el proyecto debe evitar dependencias externas, Stage 1 sigue siendo una alternativa razonable.

### Tamaño, rendimiento y parámetros para elegir

Conteo de los archivos de TypeScript/TSX que poseen, transportan o consumen el estado del carrito, sin pruebas, dominio puro, repositorio ni estilos:

| Etapa | Archivos incluidos | Líneas físicas | Líneas no vacías |
| --- | ---: | ---: | ---: |
| Stage 0: LocalReactState | 8 | 238 | 217 |
| Stage 1: Context API y `useReducer` | 11 | 298 | 262 |
| Stage 2: Zustand | 9 | 223 | 201 |

Con este alcance, Stage 2 usa 75 líneas físicas menos que Stage 1 y 15 menos que Stage 0. Las cifras comparan los commits históricos `22a1f22` y `9d31e6c` con el árbol actual; cambiar el alcance cambia el resultado. La metodología y los archivos incluidos están detallados en [ARCHITECTURE.md](ARCHITECTURE.md).

Se ejecutó un microbenchmark con React Profiler y jsdom: para el escenario de productos, Stage 2 tuvo una mediana de `actualDuration` de 0,0037 ms por acción y no volvió a renderizar `ProductList` ni sus ocho tarjetas; Stage 0 y Stage 1 sí las renderizaron. En el estrés de carrito con 100 filas, las tres etapas renderizaron las cien filas y Stage 2 tuvo mayor mediana de duración en esta corrida. Son resultados de un modelo controlado, no de un navegador real: jsdom no mide layout ni pintura y los tiempos absolutos pueden variar entre ejecuciones. El detalle y los resultados de las seis combinaciones están en [ARCHITECTURE.md](ARCHITECTURE.md). Se puede repetir con `npm run benchmark:state`.

También se comparó el build de producción: el JavaScript minificado/gzip fue 267,29/85,21 kB en Stage 0, 267,77/85,40 kB en Stage 1 y 267,49/85,39 kB en Stage 2. Stage 2 suma una dependencia runtime directa (Zustand) respecto a Stage 0, con un aumento comprimido de aproximadamente 0,18 kB en este build. El CSS quedó igual. Los detalles de versiones y método están en [ARCHITECTURE.md](ARCHITECTURE.md).

Por tanto, Stage 2 sigue recomendado por su encaje con el carrito compartido y la selección específica de estado, pero el benchmark no demuestra que sea más veloz en todos los escenarios. Para una decisión global, comparar además complejidad de mantenimiento, acoplamiento, facilidad de pruebas, tamaño del bundle y requisitos de persistencia/SSR; acordar pesos antes de puntuar cada etapa.

Además del tamaño y rendimiento, comparar complejidad de mantenimiento, facilidad de pruebas, acoplamiento de consumidores, escalabilidad al añadir acciones/consumidores, bytes comprimidos del bundle, persistencia/SSR si son requisitos y familiaridad del equipo. Asignar pesos antes de puntuar las etapas; la mejor opción depende de los objetivos, no de una métrica aislada.

## Comparar las etapas para la demo

Las tablas detalladas y los guiones de explicación están en [ARCHITECTURE.md](ARCHITECTURE.md):

- [Stage 0 frente a Stage 1 y Stage 2](ARCHITECTURE.md#comparacion-desde-stage-0-localreactstate): qué problema resuelve cada migración.
- [Stage 1 frente a Stage 0 y Stage 2](ARCHITECTURE.md#comparacion-desde-stage-1-context-api-y-usereducer): reducer/Context frente a store/selector.

Para comparar, recorre la misma secuencia en cada implementación: agregar un artículo, repetirlo, cambiar cantidad, revisar subtotal, quitarlo y verificar el estado vacío. Contrasta el camino de props, el provider y reducer, y los selectores de Zustand. Distingue los mecanismos que se observan en el código de cualquier afirmación de rendimiento que aún no haya sido medida.

## Pruebas de la implementación actual

- `cartOperations.test.ts` cubre funciones puras del dominio.
- `cartStore.test.ts` cubre estado inicial, acciones, inmutabilidad, límites y productos inexistentes.
- `CartPage.test.tsx` cubre el flujo UI conectado al store.
- `ProductCard.test.tsx` cubre la acción del componente de presentación.

La dependencia `zustand` está declarada en `package.json`. Ejecuta `npm install` desde `state-management/` para instalarla y sincronizar `package-lock.json`; después ejecuta `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`.
