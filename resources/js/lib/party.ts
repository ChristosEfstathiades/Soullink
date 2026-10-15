import { type PokemonPairType } from '@/types';

export const moveNullsToEnd = (arr: (PokemonPairType | null)[]): (PokemonPairType | null)[] => [
    ...arr.filter((x): x is PokemonPairType => x !== null),
    ...arr.filter((x) => x === null),
];

// The party in localStorage is a snapshot, so swap each slot for the latest server copy of its pair.
// Pairs that left the living box (marked dead or deleted) drop out of the party.
export function syncPartyWithBox(partyPairs: (PokemonPairType | null)[], livingBox: PokemonPairType[]): (PokemonPairType | null)[] {
    const livingById = new Map(livingBox.map((pair) => [pair.id, pair]));
    return moveNullsToEnd(partyPairs.map((pair) => (pair ? (livingById.get(pair.id) ?? null) : null)));
}

// Party data used to be stored under keys containing the save name, which renaming a save would orphan.
// Reading the old key as the starting value carries existing parties over to the id-based keys.
export function readLegacyStorage<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const value = window.localStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function partyPrimaryTypes(partyPairs: (PokemonPairType | null)[]): string[] {
    return partyPairs.flatMap((pair) => (pair ? [pair.player_one_pokemon_primary_type, pair.player_two_pokemon_primary_type] : []));
}
