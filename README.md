<div align="center">

<img src="public/storage/pokeball.svg" alt="Pokéball" width="56" />&nbsp;&nbsp;<img src="public/storage/fontbolt.png" alt="Soullink" height="90" />&nbsp;&nbsp;<img src="public/storage/pokeball.svg" alt="Pokéball" width="56" />

### Make team-building quick and easy for your two-player Pokémon Nuzlocke

A tracker and team-builder for the **Soullink Nuzlocke** challenge — two players, paired Pokémon, shared fate.

[**Live site → soullink.christosefstathiades.com**](https://soullink.christosefstathiades.com)

![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2-9553E9)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## What is a Soullink?

A [Soullink](https://nuzlockeuniversity.ca/nuzlocke-variants/soul-link-nuzlocke-rules/) is a two-player co-op variant of the Pokémon Nuzlocke challenge. Each player catches the first Pokémon on every route, and the two catches become a **linked pair** — if one faints, its partner is considered dead too. There's a catch that makes team-building tricky: **two linked Pokémon in your party can't share a type**, so picking a combined team of six is a constant balancing act.

Soullink takes care of the bookkeeping for you. Track every pair you catch, see who's alive and who's in the death box, and let the app work out which teams are even legal to run.

## Features

- **🔗 Pair tracking** — Log each player's catch as a single pair. Pokémon species, nicknames, types, and base stats are pulled automatically from [PokéAPI](https://pokeapi.co/).
- **📦 Living box & death box** — Your PC box holds living pairs; lost pairs move to a separate death box with a single checkbox toggle.
- **🧮 Smart team-builder** — Build a party of six and turn on **Highlight available pairs** to instantly fade out anything you can't legally add because of a shared typing.
- **🔒 Lock & generate** — Lock the pairs you've already committed to, then let the app **generate full legal team suggestions** around them and import a team in one click.
- **⚙️ Type normalization** — Per-save toggles for older-gen quirks: swap the Normal/Flying order, or revert retconned Fairy typings (Clefairy, Snubbull and Togepi lines) back to their original types.
- **🎨 Custom PC box wallpaper** — Pick a background for your box, just like in the real games.
- **🔐 Per-user saves** — Run multiple Soullinks at once. Every save is private to its owner.

## Screenshots

<div align="center">

| Track encounters & build your team | Generate legal teams |
| :---: | :---: |
| <img src="public/storage/tutorial/tutorial_5.png" alt="Highlight available pairs in the PC box" width="420" /> | <img src="public/storage/tutorial/tutorial_7.png" alt="Generated team suggestions" width="420" /> |

</div>

> The live site includes a full step-by-step walkthrough on the landing page.

## How it works

Soullink is built on the **Laravel React starter kit** and renders entirely through Inertia — there's no separate JSON API, every response is a server-driven page.

- **Domain model** — A `Save` is one Soullink run (two player names + normalization settings). Each `Save` has many `Pair`s, and a `Pair` stores both players' Pokémon, nicknames, types, and an `is_alive` flag. The "no shared primary type" rule is enforced server-side when a pair is created or edited.
- **Pokémon data** — A single `PokemonService` is the only thing that talks to PokéAPI (batched with `Http::pool`), and all type lookups run through one place so the normalization toggles apply consistently.
- **Team state** — The six-slot party you're assembling lives in the browser's `localStorage`; only the pairs themselves are persisted server-side.
- **Authorization** — Policies gate every action by ownership, so users can only ever read and delete their own saves and pairs.

## Built with

| Layer | Tech |
| --- | --- |
| Backend | Laravel 13 · PHP 8.3 · SQLite |
| Frontend | React 19 · TypeScript · Inertia.js 2 · Tailwind CSS v4 |
| Tooling | Vite 7 · Wayfinder (typed routes) · ESLint · Prettier · Pint |
| Testing | Pest 4 |
| Data | [PokéAPI](https://pokeapi.co/) |
| UI | shadcn/Radix primitives · dnd-kit · Embla carousel · lucide-react |

## License

The source code in this repository is released under the [MIT License](LICENSE). This covers the **application code only** — Pokémon sprites, names, and other Pokémon assets bundled in this repo are not included and remain the property of their respective owners.

## Credits

Design & original content © Christos Efstathiades, 2025–2026.

Pokémon images & names © 1995–2026 Nintendo / Creatures Inc. / GAME FREAK inc. Soullink is a fan project and is not affiliated with or endorsed by Nintendo, The Pokémon Company, or PokéAPI.
