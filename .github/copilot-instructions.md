# AI Coding Agent Instructions for Soullink

## Architecture Overview

This is a client-only React SPA (no backend). It's a Pokemon Soul Link tracker where users manage game saves with Pokemon pairs (one per player) that can be alive or dead. All data lives in the browser's localStorage and can be exported/imported as JSON.

- **Stack**: React 19 + TypeScript + Vite 7 + TailwindCSS v4 + Radix UI components + react-router-dom.
- **Data layer**: `src/lib/storage.ts` — a localStorage-backed store (`soullink:data` key) exposing hooks (`useSaves`, `useSave`, `useSavePairs`) via `useSyncExternalStore`, plus mutators (`createSave`, `createPair`, `updatePair`, etc.) and JSON `exportData`/`importData`.
- **PokeAPI**: `src/lib/pokemon.ts` fetches Pokemon data from pokeapi.co and applies per-save type-normalization settings.
- **Routing**: react-router routes in `src/main.tsx` — `/` (welcome), `/saves` (dashboard), `/saves/:saveId` (tracker), `/settings/appearance`.

## Key Workflows

- **Development**: `npm run dev` for the Vite dev server. Build with `npm run build` (outputs `dist/`).
- **Linting/Formatting**: `npm run lint` (ESLint) and `npm run format` (Prettier with Tailwind plugin).
- **Type Checking**: `npm run types` for TypeScript.

## Project-Specific Conventions

- **Pokemon Types**: Always use lowercase strings (e.g., 'fire', 'water'). Handle dual types as `[primary, secondary]` tuples, where secondary can be null.
- **Save Settings**: Respect `swap_normal_flying_order` (swaps 'normal'/'flying' order) and `revert_fairy_typing` (changes fairy to normal for specific Pokemon in `src/lib/pokemon.ts`).
- **Soullink rule**: Both Pokemon in a pair cannot share the same primary type — enforced in `createPair`/`updatePair` (`samePrimaryType` error).
- **Component Structure**: Game-specific components in `src/components/soullink/`; use Radix UI primitives from `ui/` subdirectory.
- **Styling**: TailwindCSS with class-variance-authority for component variants; type colors defined in `pokemon-pair.tsx` for consistency.
- **Mutations**: Store mutators return `{ ok: true } | { ok: false, errors }` — surface `errors` via the `InputError` component in forms.
