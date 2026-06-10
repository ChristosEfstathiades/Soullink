import { fetchPokemonTypes, type PokemonTypes } from '@/lib/pokemon';
import { type PokemonPairType, type SaveType, type SoullinkExport } from '@/types';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'soullink:data';

interface SoullinkData {
    saves: SaveType[];
    pairs: PokemonPairType[];
}

export type MutationResult = { ok: true } | { ok: false; errors: Record<string, string> };

// --- store internals -------------------------------------------------------

let cache: SoullinkData | null = null;
let pairsBySave = new Map<number, PokemonPairType[]>();
const listeners = new Set<() => void>();
const EMPTY_PAIRS: PokemonPairType[] = [];

function getData(): SoullinkData {
    if (cache === null) {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            cache = raw ? (JSON.parse(raw) as SoullinkData) : { saves: [], pairs: [] };
        } catch {
            cache = { saves: [], pairs: [] };
        }
    }
    return cache;
}

function setData(data: SoullinkData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    cache = data;
    pairsBySave = new Map();
    listeners.forEach((listener) => listener());
}

// Keep tabs in sync: another tab writing the store invalidates our cache.
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            cache = null;
            pairsBySave = new Map();
            listeners.forEach((listener) => listener());
        }
    });
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function nextId(items: { id: number }[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

// --- hooks ------------------------------------------------------------------

export function useSaves(): SaveType[] {
    return useSyncExternalStore(subscribe, () => getData().saves);
}

export function useSave(saveId: number): SaveType | undefined {
    return useSyncExternalStore(subscribe, () => getData().saves.find((save) => save.id === saveId));
}

export function useSavePairs(saveId: number | undefined): PokemonPairType[] {
    return useSyncExternalStore(subscribe, () => {
        if (saveId === undefined) return EMPTY_PAIRS;
        let pairs = pairsBySave.get(saveId);
        if (!pairs) {
            pairs = getData().pairs.filter((pair) => pair.save_id === saveId);
            pairsBySave.set(saveId, pairs);
        }
        return pairs;
    });
}

// --- saves ------------------------------------------------------------------

export interface SaveInput {
    name: string;
    player_one_name: string | null;
    player_two_name: string | null;
    swap_normal_flying_order: boolean;
    revert_fairy_typing: boolean;
}

export function createSave(input: SaveInput): SaveType {
    const data = getData();
    const save: SaveType = {
        id: nextId(data.saves),
        name: input.name,
        player_one_name: input.player_one_name,
        player_two_name: input.player_two_name,
        swap_normal_flying_order: input.swap_normal_flying_order,
        revert_fairy_typing: input.revert_fairy_typing,
        created_at: new Date().toISOString(),
    };
    setData({ ...data, saves: [...data.saves, save] });
    return save;
}

export function deleteSave(saveId: number) {
    const data = getData();
    setData({
        saves: data.saves.filter((save) => save.id !== saveId),
        pairs: data.pairs.filter((pair) => pair.save_id !== saveId),
    });
}

// --- pairs ------------------------------------------------------------------

export interface PairInput {
    playerOnePokemon: string | null;
    playerTwoPokemon: string | null;
    playerOneNickname: string | null;
    playerTwoNickname: string | null;
    location: string | null;
    isAlive?: boolean;
}

function validateNicknames(input: PairInput): Record<string, string> {
    const errors: Record<string, string> = {};
    if (input.playerOneNickname && input.playerOneNickname.length > 12) {
        errors.playerOneNickname = 'The nickname may not be greater than 12 characters.';
    }
    if (input.playerTwoNickname && input.playerTwoNickname.length > 12) {
        errors.playerTwoNickname = 'The nickname may not be greater than 12 characters.';
    }
    return errors;
}

function locationTaken(save: SaveType, location: string, ignorePairId?: number): boolean {
    return getData().pairs.some((pair) => pair.save_id === save.id && pair.location === location && pair.id !== ignorePairId);
}

export async function createPair(save: SaveType, input: PairInput): Promise<MutationResult> {
    if (!input.playerOnePokemon || !input.playerTwoPokemon) {
        return { ok: false, errors: { samePrimaryType: 'Both Pokémon are required.' } };
    }

    const nicknameErrors = validateNicknames(input);
    if (Object.keys(nicknameErrors).length > 0) {
        return { ok: false, errors: nicknameErrors };
    }

    let pokemonOneTypes, pokemonTwoTypes;
    try {
        [pokemonOneTypes, pokemonTwoTypes] = await Promise.all([
            fetchPokemonTypes(input.playerOnePokemon, save),
            fetchPokemonTypes(input.playerTwoPokemon, save),
        ]);
    } catch {
        return { ok: false, errors: { samePrimaryType: 'Failed to fetch Pokémon data. Please try again.' } };
    }

    if (pokemonOneTypes[0] === pokemonTwoTypes[0]) {
        return { ok: false, errors: { samePrimaryType: 'Both Pokémon cannot share the same primary type.' } };
    }

    const location = input.location || null;
    if (location !== null && locationTaken(save, location)) {
        return { ok: false, errors: { location: 'A pair has already been caught at this location.' } };
    }

    const data = getData();
    const pair: PokemonPairType = {
        id: nextId(data.pairs),
        save_id: save.id,
        player_one_pokemon_name: input.playerOnePokemon,
        player_two_pokemon_name: input.playerTwoPokemon,
        player_one_pokemon_nickname: input.playerOneNickname || null,
        player_two_pokemon_nickname: input.playerTwoNickname || null,
        player_one_pokemon_primary_type: pokemonOneTypes[0],
        player_one_pokemon_secondary_type: pokemonOneTypes[1],
        player_two_pokemon_primary_type: pokemonTwoTypes[0],
        player_two_pokemon_secondary_type: pokemonTwoTypes[1],
        location,
        is_alive: true,
    };
    setData({ ...data, pairs: [...data.pairs, pair] });
    return { ok: true };
}

export async function updatePair(save: SaveType, pair: PokemonPairType, input: PairInput): Promise<MutationResult> {
    const nicknameErrors = validateNicknames(input);
    if (Object.keys(nicknameErrors).length > 0) {
        return { ok: false, errors: nicknameErrors };
    }

    let pokemonOneTypes: PokemonTypes, pokemonTwoTypes: PokemonTypes;
    try {
        [pokemonOneTypes, pokemonTwoTypes] = await Promise.all([
            input.playerOnePokemon
                ? fetchPokemonTypes(input.playerOnePokemon, save)
                : ([pair.player_one_pokemon_primary_type, pair.player_one_pokemon_secondary_type] as PokemonTypes),
            input.playerTwoPokemon
                ? fetchPokemonTypes(input.playerTwoPokemon, save)
                : ([pair.player_two_pokemon_primary_type, pair.player_two_pokemon_secondary_type] as PokemonTypes),
        ]);
    } catch {
        return { ok: false, errors: { samePrimaryType: 'Failed to fetch Pokémon data. Please try again.' } };
    }

    if (pokemonOneTypes[0] === pokemonTwoTypes[0]) {
        return { ok: false, errors: { samePrimaryType: 'Both Pokémon cannot share the same primary type.' } };
    }

    const location = input.location || null;
    if (location !== null && locationTaken(save, location, pair.id)) {
        return { ok: false, errors: { location: 'A pair has already been caught at this location.' } };
    }

    const updated: PokemonPairType = {
        ...pair,
        player_one_pokemon_name: input.playerOnePokemon || pair.player_one_pokemon_name,
        player_two_pokemon_name: input.playerTwoPokemon || pair.player_two_pokemon_name,
        player_one_pokemon_nickname: input.playerOneNickname || pair.player_one_pokemon_nickname,
        player_two_pokemon_nickname: input.playerTwoNickname || pair.player_two_pokemon_nickname,
        player_one_pokemon_primary_type: pokemonOneTypes[0],
        player_one_pokemon_secondary_type: pokemonOneTypes[1],
        player_two_pokemon_primary_type: pokemonTwoTypes[0],
        player_two_pokemon_secondary_type: pokemonTwoTypes[1],
        location,
        is_alive: input.isAlive ?? true,
    };

    const data = getData();
    setData({ ...data, pairs: data.pairs.map((p) => (p.id === pair.id ? updated : p)) });
    return { ok: true };
}

export function deletePair(pairId: number) {
    const data = getData();
    setData({ ...data, pairs: data.pairs.filter((pair) => pair.id !== pairId) });
}

// --- export / import --------------------------------------------------------

export function exportData(): SoullinkExport {
    const data = getData();
    return {
        app: 'soullink',
        version: 1,
        exported_at: new Date().toISOString(),
        saves: data.saves.map((save) => ({
            ...save,
            pairs: data.pairs.filter((pair) => pair.save_id === save.id),
        })),
    };
}

// Imported saves are appended with fresh ids so they never clobber existing
// data; the export's ids only serve to link pairs to their save.
export function importData(json: string): number {
    let parsed: unknown;
    try {
        parsed = JSON.parse(json);
    } catch {
        throw new Error('The selected file is not valid JSON.');
    }

    const importedData = parsed as Partial<SoullinkExport>;
    if (importedData?.app !== 'soullink' || !Array.isArray(importedData.saves)) {
        throw new Error('The selected file is not a Soullink export.');
    }

    const data = getData();
    const saves = [...data.saves];
    const pairs = [...data.pairs];

    for (const importedSave of importedData.saves) {
        if (typeof importedSave?.name !== 'string' || !Array.isArray(importedSave.pairs)) {
            throw new Error('The selected file contains an invalid save.');
        }

        const saveId = nextId(saves);
        saves.push({
            id: saveId,
            name: importedSave.name,
            player_one_name: importedSave.player_one_name ?? null,
            player_two_name: importedSave.player_two_name ?? null,
            swap_normal_flying_order: Boolean(importedSave.swap_normal_flying_order),
            revert_fairy_typing: Boolean(importedSave.revert_fairy_typing),
            created_at: typeof importedSave.created_at === 'string' ? importedSave.created_at : new Date().toISOString(),
        });

        for (const importedPair of importedSave.pairs) {
            if (typeof importedPair?.player_one_pokemon_name !== 'string' || typeof importedPair?.player_two_pokemon_name !== 'string') {
                throw new Error('The selected file contains an invalid pair.');
            }

            pairs.push({
                id: nextId(pairs),
                save_id: saveId,
                player_one_pokemon_name: importedPair.player_one_pokemon_name,
                player_two_pokemon_name: importedPair.player_two_pokemon_name,
                player_one_pokemon_nickname: importedPair.player_one_pokemon_nickname ?? null,
                player_two_pokemon_nickname: importedPair.player_two_pokemon_nickname ?? null,
                player_one_pokemon_primary_type: importedPair.player_one_pokemon_primary_type ?? 'normal',
                player_one_pokemon_secondary_type: importedPair.player_one_pokemon_secondary_type ?? null,
                player_two_pokemon_primary_type: importedPair.player_two_pokemon_primary_type ?? 'normal',
                player_two_pokemon_secondary_type: importedPair.player_two_pokemon_secondary_type ?? null,
                location: importedPair.location ?? null,
                is_alive: importedPair.is_alive !== false,
            });
        }
    }

    setData({ saves, pairs });
    return importedData.saves.length;
}
