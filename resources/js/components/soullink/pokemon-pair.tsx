import { type PokemonPairType } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import {Plus} from 'lucide-react';


const typeColors: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};



export default function PokemonPair({
  pair,
  setLoadedPair,
  viewDeathBox,
  unavailableTypes = [],
  highlightAvailablePairs = false,
  addToParty,
}: {
  pair: PokemonPairType;
  setLoadedPair?: (pair: PokemonPairType) => void;
  viewDeathBox: boolean;
  unavailableTypes?: string[];
  highlightAvailablePairs?: boolean;
  addToParty: (event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) => void;
}) {
  const playerOneColor = typeColors[pair.player_one_pokemon_primary_type] || '#FFFFFF';
  const playerTwoColor = typeColors[pair.player_two_pokemon_primary_type] || '#FFFFFF';
  

  function highlightedPair() {
    return !((unavailableTypes.includes(pair.player_one_pokemon_primary_type) || unavailableTypes.includes(pair.player_two_pokemon_primary_type)) && highlightAvailablePairs)
  }

  return (
    <div
      onClick={() => setLoadedPair && setLoadedPair(pair)}
      className="rounded-4xl flex shrink-0 transition hover:scale-105 relative shadow-2xl group"
      style={{display: viewDeathBox ? 'none' : '', opacity: highlightedPair() ? 1 : 0.4}}
    
    >
      {/* Gradient background layer */}
      <div
        className="absolute inset-0 rounded-4xl opacity-100"
        style={{
          background: `linear-gradient(to right, ${playerOneColor}, ${playerTwoColor})`,
        }}
      />
      <div style={{opacity: (unavailableTypes.includes(pair.player_one_pokemon_primary_type) || unavailableTypes.includes(pair.player_two_pokemon_primary_type)) ? 0.4 : 1, display: (pair.is_alive == 0 ? 'none' : '')}} onClick={(event) => addToParty(event, pair)} className="absolute p-0.5 bottom-0 right-0 sm:hidden sm:group-hover:block z-49 bg-white rounded-full cursor-pointer" ><Plus color="red" /></div>
      

      {/* Pokémon images layer */}
      <div className="relative flex w-full justify-between items-center z-10">
        <img
          draggable="false"
          className="w-13.5 lg:w-18"
          src={`/storage/${pair.player_one_pokemon_name}.png`}
          alt={pair.player_one_pokemon_name}
        />
        <img
          draggable="false"
          className="w-13.5 lg:w-18"
          src={`/storage/${pair.player_two_pokemon_name}.png`}
          alt={pair.player_two_pokemon_name}
        />
      </div>
    </div>
  );
}
