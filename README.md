# Mi Tienda — Parcial

App de inventario para la tienda de Doña Rosa: funciona sin internet (SQLite) y respalda los productos en Supabase al tocar **Sincronizar**.

**Estudiante:** NOMBRE COMPLETO
**Código:** CÓDIGO

## Tecnologías

Expo + TypeScript · Expo Router (`Stack.Protected`) · SQLite con Drizzle ORM (`useMigrations`, `useLiveQuery`) · Supabase (Auth + Postgres con RLS) · SecureStore para la sesión.

## Cómo ejecutar

1. **Supabase**
   - En *SQL Editor*, ejecutar [`supabase/schema.sql`](supabase/schema.sql) (crea la tabla `products` con RLS).
   - En *Authentication → Sign In / Providers → Email*, desactivar **Confirm email**.
2. **Variables de entorno**: copiar `.env.example` a `.env` y poner la URL y la *publishable key* del proyecto (Project Settings → API).
   ```bash
   cp .env.example .env
   ```
3. **Instalar y ejecutar**
   ```bash
   npm install
   npx expo start
   ```
4. Si se cambia `db/schema.ts`, regenerar la migración con `npx drizzle-kit generate`.

## Estructura

```
app/
  _layout.tsx        Migraciones + rutas protegidas con Stack.Protected
  login.tsx          Inicio de sesión
  registro.tsx       Registro con validaciones
  index.tsx          Inventario: lista, totales, pendientes, Sincronizar, búsqueda
  producto.tsx       Crear / editar producto (recibe ?id=)
context/AuthContext.tsx   Sesión de Supabase (signUp, signInWithPassword, signOut)
lib/secureStorage.ts      Adaptador de SecureStore por fragmentos
lib/supabase.ts           Cliente de Supabase
db/schema.ts              Tabla products (Drizzle)
db/client.ts              Conexión SQLite
db/repositories/products.ts  Único lugar que usa Drizzle
hooks/useProducts.ts      Lista reactiva + totales para las pantallas
services/sync.ts          syncProducts(userId): bajar y luego subir
drizzle/                  Migración generada por drizzle-kit
```

## Cómo funciona la sincronización

- SQLite es la fuente de verdad: todas las pantallas leen y escriben en local.
- Un producto está **pendiente** si `syncedAt` está vacío o es anterior a `updatedAt`. Cada creación o edición escribe `updatedAt = new Date()`.
- `syncProducts(userId)`:
  1. **Bajar**: trae los productos del usuario y los inserta en SQLite si su `client_id` no existe localmente, marcándolos como sincronizados.
  2. **Subir**: hace `upsert` por `client_id` de los pendientes y guarda `syncedAt = updatedAt` subido. Como se usa `client_id`, repetir la sincronización no duplica filas.

## Capturas

![Login](capturas/01-login.png)
![Registro](capturas/02-registro.png)
![Principal](capturas/03-principal.png)
![Formulario](capturas/04-formulario.png)
![Sin conexión](capturas/05-sin-conexion.png)
![Sincronizado](capturas/06-sincronizado.png)
![Supabase](capturas/07-supabase.png)

## Qué quedó funcionando

- [x] Login, registro (correo válido, mínimo 6 caracteres, contraseñas iguales) y cierre de sesión
- [x] Rutas protegidas con `Stack.Protected`; sesión en SecureStore que sobrevive al cerrar la app
- [x] CRUD en SQLite con Drizzle, funciona en modo avión
- [x] Lista reactiva con `useLiveQuery`, total de unidades, valor total y número de pendientes
- [x] Indicador por producto: "En la nube" / "Pendiente"
- [x] Confirmación al eliminar (mantener presionado)
- [x] Sincronizar: baja lo que falta y sube pendientes sin duplicar; muestra el resultado o el error

**Puntos extra implementados**
- [x] Búsqueda por nombre en la pantalla principal
- [x] Regla "gana el último cambio" al bajar: si la nube tiene una versión con `updated_at` más reciente, reemplaza la local

**No implementado:** borrado sincronizado (`deletedAt`) y sincronización automática al recuperar la conexión. Eliminar un producto solo lo borra del teléfono.

**Nota:** al cerrar sesión se limpia la base local (para que otro usuario no vea los productos); si hay pendientes, la app avisa antes.
