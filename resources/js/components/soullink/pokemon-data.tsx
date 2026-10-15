import BaseStat from '@/components/soullink/base-stat';
import { typeColors } from '@/lib/pokemon-types';
import { ExternalLink } from 'lucide-react';

interface PokemonDataProps {
    name: string;
    data: {
        bst: number[];
        types: string[];
    };
}
export default function PokemonData({ name, data }: PokemonDataProps) {
    return (
        <div className="mt-2 flex items-center">
            <div className="flex flex-col">
                <img draggable="false" className="w-34 lg:w-38" src={`/storage/${name}.png`} alt={name} />
                <div className="mt-2 flex items-center gap-x-1">
                    {data?.types.map((type, index) => (
                        <div className="flex items-center" key={index}>
                            {type ? (
                                <span
                                    style={{ backgroundColor: typeColors[type] }}
                                    className="rounded border border-black/15 px-2 text-center text-xs text-white text-shadow-md"
                                >
                                    {type.toUpperCase()}
                                </span>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col">
                <ul className="text-xs">
                    {data?.bst.map((stat, index) => (
                        <BaseStat key={index} category={index} stat={stat} />
                    ))}
                </ul>
                <a
                    className="mt-2 flex items-center self-end text-xs hover:underline"
                    target="_blank"
                    href={`https://pokemondb.net/pokedex/${name}`}
                >
                    Pokedex <ExternalLink className="ml-0.5" size={14} />
                </a>
            </div>
        </div>
    );
}
