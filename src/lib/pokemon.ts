import { type SaveType } from '@/types';

// Gen-1/2 Pokémon retconned to fairy in Gen 6 — reverted to normal when the
// save has `revert_fairy_typing` enabled.
const FAIRY_POKEMON = ['cleffa', 'clefairy', 'clefable', 'granbull', 'snubbull', 'togepi', 'togetic', 'togekiss'];

// [primary, secondary] — secondary is null for mono-typed Pokémon.
export type PokemonTypes = [string, string | null];

interface PokeApiPokemon {
    types: { type: { name: string } }[];
}

export async function fetchPokemonData(pokemonName: string): Promise<PokeApiPokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon data for "${pokemonName}" (${response.status})`);
    }

    return response.json();
}

export function swapNormalFlyingOrder(pokemonTypes: PokemonTypes): PokemonTypes {
    if (pokemonTypes[0] === 'normal' && pokemonTypes[1] === 'flying') {
        return ['flying', 'normal'];
    }

    return pokemonTypes;
}

export function revertFairyTyping(pokemonTypes: PokemonTypes, pokemon: string): PokemonTypes {
    if (pokemonTypes[0] === 'fairy' && FAIRY_POKEMON.includes(pokemon.toLowerCase())) {
        return ['normal', pokemonTypes[1]];
    }

    return pokemonTypes;
}

export function applySettings(types: PokemonTypes, pokemonName: string, save: SaveType): PokemonTypes {
    if (save.swap_normal_flying_order) {
        types = swapNormalFlyingOrder(types);
    }

    if (save.revert_fairy_typing) {
        types = revertFairyTyping(types, pokemonName);
    }

    return types;
}

export async function fetchPokemonTypes(pokemonName: string, save: SaveType): Promise<PokemonTypes> {
    const pokemonData = await fetchPokemonData(pokemonName);

    const names = pokemonData.types.map((type) => type.type.name);
    const types: PokemonTypes = [names[0], names[1] ?? null];

    return applySettings(types, pokemonName, save);
}
