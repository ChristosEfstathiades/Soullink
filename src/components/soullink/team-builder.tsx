import GeneratedTeams from '@/components/soullink/generated-teams';
import PokemonParty from '@/components/soullink/pokemon-party';
import { type PokemonPairType } from '@/types';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

interface TeamBuilderProps {
    livingBox: PokemonPairType[];
    partyPairs: (PokemonPairType | null)[];
    setPartyPairs: (pairs: (PokemonPairType | null)[]) => void;
    setUnavailableTypes: (types: string[]) => void;
    removePartyPairs: () => void;
    unavailableTypes: string[];
    save: {
        id: number;
        name: string;
        player_one_name: string | null;
        player_two_name: string | null;
    };
}

const typeNumbers: { [key: string]: number } = {
    normal: 1,
    fire: 2,
    water: 3,
    electric: 4,
    grass: 5,
    ice: 6,
    fighting: 7,
    poison: 8,
    ground: 9,
    flying: 10,
    psychic: 11,
    bug: 12,
    rock: 13,
    ghost: 14,
    dragon: 15,
    dark: 16,
    steel: 17,
    fairy: 18,
};

// Selects teams of `targetSize` pairs such that no primary type is used twice
// across the team. Works on pair objects directly so the exact locked pairs end
// up in every team (no matching back by type, which could pick a same-typed pair).
function generateTeamCombinations(
    pairs: PokemonPairType[],
    targetSize: number,
    requiredPairs: PokemonPairType[],
    maxResults: number,
): PokemonPairType[][] {
    const solutions: PokemonPairType[][] = [];

    const typesOf = (pair: PokemonPairType): [number, number] => [
        typeNumbers[pair.player_one_pokemon_primary_type],
        typeNumbers[pair.player_two_pokemon_primary_type],
    ];

    // Lock the required pairs in up front and reserve their primary types.
    const used = new Set<number>();
    const startingChosen: PokemonPairType[] = [];
    for (const pair of requiredPairs) {
        const [a, b] = typesOf(pair);
        used.add(a);
        used.add(b);
        startingChosen.push(pair);
    }

    // Candidate pool excludes the locked pairs (already chosen).
    const requiredIds = new Set(requiredPairs.map((pair) => pair.id));
    const candidatePairs = pairs.filter((pair) => !requiredIds.has(pair.id));

    function backtrack(start: number, chosen: PokemonPairType[]) {
        if (solutions.length >= maxResults) return;

        if (chosen.length === targetSize) {
            solutions.push([...chosen]);
            return;
        }

        // Early pruning: not enough candidates left to fill the team.
        if (candidatePairs.length - start < targetSize - chosen.length) return;

        for (let i = start; i < candidatePairs.length; i++) {
            const [a, b] = typesOf(candidatePairs[i]);
            // Skip pairs that reuse a primary type already on the team.
            if (used.has(a) || used.has(b)) continue;

            used.add(a);
            used.add(b);
            chosen.push(candidatePairs[i]);
            backtrack(i + 1, chosen);
            chosen.pop();
            used.delete(a);
            used.delete(b);
        }
    }

    backtrack(0, startingChosen);
    return solutions;
}

function generateTeams(pokemon: PokemonPairType[], lockedPairs: number[], targetSize: number = 6, maxResults: number = 12) {
    const lockedSet = new Set(lockedPairs);
    const requiredPairs = pokemon.filter((pair) => lockedSet.has(pair.id));

    let solutions: PokemonPairType[][] = [];
    for (let size = targetSize; size >= 2 && solutions.length === 0; size--) {
        solutions = generateTeamCombinations(pokemon, size, requiredPairs, maxResults);
    }
    return solutions;
}

const moveNullsToEnd = (arr: (PokemonPairType | null)[]): (PokemonPairType | null)[] => [
    ...arr.filter((x): x is PokemonPairType => x !== null),
    ...arr.filter((x) => x === null),
];

export default function TeamBuilder({
    save,
    livingBox,
    partyPairs,
    setPartyPairs,
    setUnavailableTypes,
    unavailableTypes,
    removePartyPairs,
}: TeamBuilderProps) {
    const [lockedPairs, setLockedPairs] = useLocalStorage<number[]>(`LockedPairs-${save.name}-${save.id}`, []);
    const [generatedTeams, setGeneratedTeams] = useState<PokemonPairType[][]>([]);

    function removeFromParty(event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) {
        event.stopPropagation();
        const newPartyPairs = moveNullsToEnd(partyPairs.map((p) => (p && p.id === pair.id ? null : p)));
        setPartyPairs(newPartyPairs);
        setUnavailableTypes(
            unavailableTypes.filter((type) => type !== pair.player_one_pokemon_primary_type && type !== pair.player_two_pokemon_primary_type),
        );
        setLockedPairs(lockedPairs.filter((id) => id !== pair.id));
    }

    function displayGeneratedTeams() {
        const teams = generateTeams(livingBox, lockedPairs);
        // Order locked pairs at the top of each team (stable sort keeps the rest in place)
        const orderedTeams = teams.map((team) => [...team].sort((a, b) => Number(lockedPairs.includes(b.id)) - Number(lockedPairs.includes(a.id))));
        setGeneratedTeams(orderedTeams);
    }

    function importTeamToParty(team: PokemonPairType[]) {
        removePartyPairs();
        const types: string[] = [];
        const newPartyPairs = Array(6).fill(null);
        team.forEach((pair: PokemonPairType) => {
            const emptyIndex = newPartyPairs.findIndex((p) => p === null);
            newPartyPairs[emptyIndex] = pair;
            types.push(pair.player_one_pokemon_primary_type, pair.player_two_pokemon_primary_type);
        });
        setPartyPairs(newPartyPairs);
        setUnavailableTypes(types);
    }

    return (
        <section className="mr-4 flex min-w-39 grow flex-col items-center lg:min-w-48">
            <h2 className="h-8 text-center text-2xl font-bold">Party</h2>
            <PokemonParty lockedPairs={lockedPairs} setLockedPairs={setLockedPairs} removeFromParty={removeFromParty} partyPairs={partyPairs} />
            <GeneratedTeams importTeamToParty={importTeamToParty} teams={generatedTeams} displayGeneratedTeams={displayGeneratedTeams} />
        </section>
    );
}
