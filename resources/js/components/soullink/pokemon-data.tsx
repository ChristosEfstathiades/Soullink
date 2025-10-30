import BaseStat from '@/components/soullink/base-stat';
import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
 

interface PokemonDataProps {
  name: string;
  data: {
      bst: number[];
      types: string[];
};
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
export default function PokemonData({name, data}: PokemonDataProps) {
    return (
        <div className="flex items-center mt-2">
            <div>
                <img draggable="false" className="w-30 lg:w-38 mr-4" src={`/storage/${name}.png`} alt={name} />
                <div className='flex justify-center gap-x-1'>
                    {data?.types.map((type, index)  => (
                        <div className='flex items-center' key={index}>
                            {type ? <span style={{ backgroundColor: typeColors[type] }} className='text-shadow-md text-center text-xs text-white px-2 border border-black/15 rounded'>{type.toUpperCase()}</span> : null}
                        </div>
                    ))}
                    <a className='text-xs items-center flex hover:underline' target='_blank' href={`https://pokemondb.net/pokedex/${name}`} >Pokedex <ExternalLink className='ml-0.5' size={14} /></a>
                </div>
            </div>

            <ul className="text-xs">
                {data?.bst.map((stat, index) => (
                <BaseStat key={index} category={index} stat={stat} />
                ))}
            </ul>
        </div>
    );
}