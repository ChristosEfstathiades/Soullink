import { PokemonPairType } from '@/types';
import { Minus } from 'lucide-react';

// TODO: extract HTML/Variables from pokemonParty and PokemonPair into reusable components

interface PokemonPartyProps {
  partyPairs: (PokemonPairType | null)[];
  removeFromParty: (event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) => void;
}
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

export default function PokemonParty({ partyPairs, removeFromParty }: PokemonPartyProps) {
    return (
        <section className="flex flex-col mt-4">
            {partyPairs.map((pair, index) => (
                <div className='flex mb-4' key={index}>
                    {pair ? ( 
                        <div
                        className="rounded-4xl flex shrink-0  transition-transform hover:scale-105 relative shadow-2xl group"
                        // TODO: add loadedPair functionality
                        >
                        {/* Gradient background layer */}
                        <div
                            className="absolute inset-0 rounded-4xl opacity-100"
                            style={{
                            background: `linear-gradient(to right, ${typeColors[pair.player_one_pokemon_primary_type]},rgba(255, 255, 255, 0.85) 50%, ${typeColors[pair.player_two_pokemon_primary_type]})`,
                            }}
                        />
                        <div onClick={(event) => removeFromParty(event, pair)} className="absolute p-0 bottom-0 right-0 hidden group-hover:block z-100 bg-red-600 rounded-full cursor-pointer" ><Minus color="white" /></div>
                        

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
                    ) : (<p>goodbye</p>)}
                </div>
            ))}
        </section>
    );
}
