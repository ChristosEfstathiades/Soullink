# AI Coding Agent Instructions for Soullink

## Architecture Overview

This is a Laravel 12 application with an Inertia.js-powered React SPA frontend. It's a Pokemon Soul Link tracker where users manage game saves with Pokemon pairs (one per player) that can be alive or dead.

- **Backend**: Laravel with Eloquent models (`User`, `Save`, `Pair`), controllers using Inertia rendering, policies for authorization, and a `PokemonService` that fetches data from PokeAPI.co.
- **Frontend**: React + TypeScript + TailwindCSS + Radix UI components. Uses TanStack Query for data fetching and DnD Kit for drag-and-drop team building.
- **Routing**: Laravel Wayfinder generates TypeScript route helpers (e.g., `import { index } from '@/routes/saves'`).
- **Data Flow**: Controllers pass data to Inertia pages via props; components handle UI interactions with server-side mutations.

## Key Workflows

- **Development**: Run `npm run dev` for Vite dev server; use `php artisan serve` for Laravel. Build with `npm run build`.
- **Testing**: Use Pest (`./vendor/bin/pest`) for PHP tests; focus on feature tests with HTTP faking for PokeAPI calls.
- **Linting/Formatting**: `npm run lint` (ESLint) and `npm run format` (Prettier with Tailwind plugin).
- **Type Checking**: `npm run types` for TypeScript.

## Project-Specific Conventions

- **Pokemon Types**: Always use lowercase strings (e.g., 'fire', 'water'). Handle dual types as `[primary, secondary]` arrays, where secondary can be null.
- **Save Settings**: Respect `swap_normal_flying_order` (swaps 'normal'/'flying' order) and `revert_fairy_typing` (changes fairy to normal for specific Pokemon in `PokemonService::$fairyPokemon`).
- **Authorization**: Use Gates in controllers (e.g., `Gate::authorize('view', $save)`); policies exist for `Save` and `Pair` models.
- **Component Structure**: Game-specific components in `resources/js/components/soullink/`; use Radix UI primitives from `ui/` subdirectory.
- **Styling**: TailwindCSS with class-variance-authority for component variants; type colors defined in `pokemon-pair.tsx` for consistency.
- **Error Handling**: Throw `RuntimeException` for PokeAPI failures with status codes; use Laravel's validation requests (e.g., `StoreSaveRequest`).

## Examples

- Fetching Pokemon types: `app/Services/PokemonService.php::fetchPokemonTypes()` - applies save settings after API call.
- Rendering pages: Controllers return `Inertia::render('tracker', ['save' => $save, 'livingBox' => $alivePairs])`.
- Route usage: `to_route('saves.show', $save)` in redirects; Wayfinder imports like `import { index } from '@/routes/saves'`.
- Testing API calls: Fake PokeAPI responses in Pest tests using `Http::fake(['pokeapi.co/*' => Http::response($fakeData)])`.</content>
  <parameter name="filePath">c:\xampp\htdocs\Projects\Soullink\.github\copilot-instructions.md
