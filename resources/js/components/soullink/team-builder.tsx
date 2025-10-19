import PokemonParty from '@/components/soullink/pokemon-party';
import { Button } from '@/components/ui/button';
import {useDraggable} from '@dnd-kit/core';
import { type PokemonPairType } from '@/types';



interface TeamBuilderProps {
  livingBox: PokemonPairType[];
}

// TODO: generate teams from pairs. 
// Options: prioritise type coverage, lock certain pairs in party, enforce unique primary types, 
// normal/flying -> flying, revert fairy types. 
// type coverage: count number of resistances, check if for every weakness there is a resistance

// algorithm:
// 1. filter out pairs based on team generation options
// 2. Added locked pairs to each possible team
// 3. [2,7]: 21, 4 

// 7. return the team with the highest type coverage score
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
    let uniquePairs: number[] = [];
    pokemon.map((pair: PokemonPairType) => {
        if (typeTally[pair.player_one_pokemon_primary_type] == 1 && typeTally[pair.player_two_pokemon_primary_type] == 1) {
            uniquePairs.push(pair.id)
        }
    })
    let remainingSlots = 6 - uniquePairs.length
    let unavailableTypes: string[] = [];
    console.log(remainingSlots)
    
}

export default function TeamBuilder({livingBox}: TeamBuilderProps) {

    return (
        <section className="flex flex-col">
            <h2 className="text-2xl font-bold text-center my-4">Team Builder</h2>
            <Button onClick={() => generateTeam(livingBox)}>generate team</Button>
            <PokemonParty/>
        </section>
    );
}