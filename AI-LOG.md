# Registro de uso de IA

**Herramienta:** Claude (Anthropic)

## Prompt usado

> "Ayúdame a realizar este proyecto" (adjuntando el PDF del enunciado del parcial).

La IA generó la estructura del proyecto: pantallas, esquema de Drizzle, repositorio, hook, contexto de autenticación y `services/sync.ts`.

## Qué corregí / revisé del código generado

<!-- Completa con lo que TÚ cambiaste. Ejemplos reales de este proyecto: -->
- Al usar un `babel.config.js` propio (para el plugin `inline-import` de los `.sql`), Metro fallaba con `Cannot find module 'babel-preset-expo'`. Se instaló `babel-preset-expo` como dependencia de desarrollo.
- Revisé que `db/schema.ts` no importe paquetes de Expo (el UUID se genera en el repositorio con `Crypto.randomUUID()`), porque drizzle-kit lee ese archivo con Node.
- _(agrega aquí tus propios cambios)_

## Alucinación detectada

<!-- Si detectaste una, descríbela. Si no, escribe "No detecté alucinaciones". -->
- _(completar)_
