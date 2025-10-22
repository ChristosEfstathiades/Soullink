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
function generateTeam(pokemon: PokemonPairType[]) {
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
    let remainingSlots = 6 - uniquePairs.length
    let unavailableTypes: string[] = [];
    console.log(uniquePairs)
    
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
        <section className="flex flex-col mr-4  min-w-37 lg:min-w-46 grow">
            <h2 className="text-2xl font-bold text-center h-8">Party</h2>
            <PokemonParty lockedPairs={lockedPairs} setLockedPairs={setLockedPairs} removeFromParty={removeFromParty} partyPairs={partyPairs} />
            {/* <Button onClick={() => generateTeam(livingBox)}>generate team</Button> */}
        </section>
    );
}