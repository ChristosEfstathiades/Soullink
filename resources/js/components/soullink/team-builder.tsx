import PokemonParty from '@/components/soullink/pokemon-party';
import { Button } from '@/components/ui/button';
import { type PokemonPairType } from '@/types';
import { useState } from 'react';
import { useLocalStorage} from 'usehooks-ts'




interface TeamBuilderProps {
  livingBox: PokemonPairType[];
  partyPairs: (PokemonPairType | null)[];
  setPartyPairs: (pairs: (PokemonPairType | null)[]) => void;
  setUnavailableTypes: (types: string[]) => void;
  unavailableTypes: string[];
  save: {
        id: number;
        name: string;
        player_one_name: string | null;
        player_two_name: string | null;
    };
}

// TODO: generate teams from pairs. 
// Options: prioritise type coverage, lock certain pairs in party, enforce unique primary types, 
// normal/flying -> flying, revert fairy types. 
// type coverage: count number of resistances, check if for every weakness there is a resistance


// return the team with the highest type coverage score
const typeTally: { [key: string]: number } = {
    normal: 0,
    fire: 0,
    water: 0,
    electric: 0,
    grass: 0,
    ice: 0,
    fighting: 0,
    poison: 0,
    ground: 0,
    flying: 0,
    psychic: 0,
    bug: 0,
    rock: 0,
    ghost: 0,
    dragon: 0,
    dark: 0,
    steel: 0,
    fairy: 0,
};

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
}

function generateUniquePairs(pokemon: PokemonPairType[]) {
    for (const key in typeTally) {
        typeTally[key] = 0;
    }
    pokemon.map((pair: PokemonPairType) => {
        typeTally[pair.player_one_pokemon_primary_type] += 1
        typeTally[pair.player_two_pokemon_primary_type] += 1
    })
    let uniquePairs: PokemonPairType[] = [];
    pokemon.map((pair: PokemonPairType) => {
        if (typeTally[pair.player_one_pokemon_primary_type] == 1 && typeTally[pair.player_two_pokemon_primary_type] == 1) {
            uniquePairs.push(pair)
        }
    })
    console.log(uniquePairs)
}

function generateTeamCombinations(pairs: number[][], targetSize: number, requiredPairs: number[][], maxResults: number) {
    const solutions : number[][] = [];

    // Normalize all pairs so that [2,1] -> [1,2]
    pairs = pairs.map(([a, b]) => (a < b ? [a, b] : [b, a]));
    requiredPairs = requiredPairs.map(([a, b]) => (a < b ? [a, b] : [b, a]));

    const used = new Set();
    let startingChosen = [];
    for (const [a,b] of requiredPairs) {
        used.add(a);
        used.add(b);
        startingChosen.push([a,b]);
    }

    const forbiddenNumbers = new Set(requiredPairs.flat());
    const filteredPairs = pairs.filter(
        ([a, b]) => !forbiddenNumbers.has(a) && !forbiddenNumbers.has(b)
    );

    function backtrack(start: number, chosen: any[], used: any) {
        if (solutions.length >= maxResults) return;

        if (chosen.length === targetSize) {
            const sorted = [...chosen].sort((a, b) => a[0] - b[0]);
            solutions.push(sorted);
            return;
        }

        // Early pruning
        if (filteredPairs.length - start < targetSize - chosen.length) return;

        for (let i = start; i < filteredPairs.length; i++) {
            const [a, b] = filteredPairs[i];
            if (used.has(a) || used.has(b)) continue;

            used.add(a);
            used.add(b);
            backtrack(i + 1, [...chosen, [a, b]], used);
            used.delete(a);
            used.delete(b);
        }
    }

    backtrack(0, startingChosen, new Set(used));
    return solutions;
}

function generateTeam(pokemon: PokemonPairType[], lockedPairs: number[], targetSize: number=6, maxResults: number=10) {
    // create array of typing pairs etc normal = 1, flying = 11, (1,11)
    let typeCombinations: number[][] = [];
    let lockedTypeCombinations: number[][] = [];
    pokemon.map((pair: PokemonPairType) => {
        typeCombinations.push([typeNumbers[pair.player_one_pokemon_primary_type], typeNumbers[pair.player_two_pokemon_primary_type]]);
        if (lockedPairs.includes(pair.id)) {
            lockedTypeCombinations.push([typeNumbers[pair.player_one_pokemon_primary_type], typeNumbers[pair.player_two_pokemon_primary_type]]);
        }
    })
    // Create dictionary of pair ids and type combinations so (1,11): 23, 4, ...

    // run chatgpt code for team size of 6 then decrease team sieze until results found

    let solutions : number[][] = []
    for (let size = targetSize; size >= 2 && solutions.length === 0; size--) {
        solutions = generateTeamCombinations(typeCombinations, size, lockedTypeCombinations, maxResults);
    }
    console.log(solutions)
    // use dictionary to create teams
    // evaluate teams based on type coverage
    // create dialog that suggests best x amount of teams
    // Add import button for each suggested team that loads them from box into party
}

const moveNullsToEnd = (arr: (PokemonPairType | null)[]): (PokemonPairType | null)[] =>
  [...arr.filter((x): x is PokemonPairType => x !== null), ...arr.filter(x => x === null)];



export default function TeamBuilder({save, livingBox, partyPairs, setPartyPairs, setUnavailableTypes, unavailableTypes}: TeamBuilderProps) {
    const [lockedPairs, setLockedPairs] = useLocalStorage<number[]>(`LockedPairs-${save.name}-${save.id}`, []);

    function removeFromParty(event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) {
        event.stopPropagation();
        const newPartyPairs = moveNullsToEnd(partyPairs.map(p => p && p.id === pair.id ? null : p));
        setPartyPairs(newPartyPairs);
        setUnavailableTypes(unavailableTypes.filter(type => type !== pair.player_one_pokemon_primary_type && type !== pair.player_two_pokemon_primary_type));
        setLockedPairs(lockedPairs.filter(id => id !== pair.id));
    }

    return (
        <section className="flex flex-col mr-4  min-w-39 lg:min-w-48 grow">
            <h2 className="text-2xl font-bold text-center h-8">Party</h2>
            <PokemonParty lockedPairs={lockedPairs} setLockedPairs={setLockedPairs} removeFromParty={removeFromParty} partyPairs={partyPairs} />
            <Button onClick={() => generateTeam(livingBox, lockedPairs)}>Generate Team</Button>
        </section>
    );
}