# Module SDK

This package defines the **public SDK contract** for external modules.

## Structure

- `src/index.ts`: types + constants (stable contract).
- `src/server.ts`: optional server helpers (event emit + config + action controller).
- `src/i18n/types.ts`: module i18n types and namespacing.

## Build

```
pnpm build
```

Output goes to `dist/`.

## I18n namespacing

Module translations should live under the `mod.<moduleId>.*` namespace.
Use `ModuleMessagesByArea` to type module bundles.
