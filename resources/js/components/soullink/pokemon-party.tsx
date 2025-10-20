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
        <section className="flex flex-col mt-4 items-center">
            {partyPairs.map((pair, index) => (
                <div className='flex mb-2 ' key={index}>
                    {pair ? ( 
                        <div
                        className="rounded-4xl flex shrink-0  transition-transform hover:scale-105 relative shadow-lg group"
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
                    ) : ( 
                        <img className='h-18' src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dfgb85u-cf7e1762-c99f-4a72-b93a-6bd7539f1058.png/v1/fill/w_1280,h_1280/light_grey_pokeball_by_jormxdos_dfgb85u-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiIvZi9lOGRkYzRkYS0yM2RkLTQ1MDItYjY1Yi0zNzhjOWNmZTVlZmEvZGZnYjg1dS1jZjdlMTc2Mi1jOTlmLTRhNzItYjkzYS02YmQ3NTM5ZjEwNTgucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.sdLoFrBVSkMHElQJDy4ekXhoFzKQAWSChIXv659NpzI" alt="" /> 
                    )}
                </div>
            ))}
        </section>
    );
}
