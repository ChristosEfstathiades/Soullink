import { PokemonPairType } from '@/types';
import { Minus, LockOpen, Lock } from 'lucide-react';

// TODO: extract HTML/Variables from pokemonParty and PokemonPair into reusable components

interface PokemonPartyProps {
  partyPairs: (PokemonPairType | null)[];
  removeFromParty: (event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) => void;
  lockedPairs: number[];
  setLockedPairs: (lockedPairs: number[]) => void;
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

export default function PokemonParty({ partyPairs, removeFromParty, lockedPairs, setLockedPairs }: PokemonPartyProps) {
    function setLockStatus(pairID: number) {
        if (lockedPairs.includes(pairID)) {
            setLockedPairs(lockedPairs.filter(id => id !== pairID));
        } else {
            setLockedPairs([...lockedPairs, pairID]);
        }
    }


    return (
        <section className="flex flex-col  items-center">
            {partyPairs.map((pair, index) => (
                <div className='flex mb-4 ' key={index}>
                    {pair ? ( 
                        <div className='flex items-center'>
                            <div onClick={() => setLockStatus(pair.id)} className='cursor-pointer p-2 hover:bg-accent rounded-sm mr-2 transition-colors'>
                                {lockedPairs.includes(pair.id) ? <Lock /> : <LockOpen />}
                            </div>
                            <div
                            className="rounded-4xl flex shrink-0 transition-transform hover:scale-105 relative shadow-lg group"
                            >
                            {/* Gradient background layer */}
                                <div
                                    className="absolute inset-0 rounded-4xl opacity-100"
                                    style={{
                                    background: `linear-gradient(to right, ${typeColors[pair.player_one_pokemon_primary_type]}, ${typeColors[pair.player_two_pokemon_primary_type]})`,
                                    }}
                                />
                                <div onClick={(event) => removeFromParty(event, pair)} className="absolute p-0 bottom-0 right-0 sm:hidden sm:group-hover:block z-100 bg-red-600 rounded-full cursor-pointer" ><Minus color="white" /></div>
                                

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
                        </div>
                    ) : ( 
                        <div className='flex items-center'>
                            <img className='h-13.5  lg:h-18' src="/storage/light_grey_pokeball.png" alt="" /> 
                            <hr className='border-t border-1 border-dashed w-5 bg-white text-white border-[#ff1c1c]'/>
                            <img className='h-13.5  lg:h-18' src="/storage/light_grey_pokeball.png" alt="" /> 

                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}
