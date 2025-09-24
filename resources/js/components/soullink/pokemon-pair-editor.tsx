import { useEffect, useState } from "react";
import { LoaderCircle } from 'lucide-react';
import { log } from "console";
import { destroy } from "@/actions/App/Http/Controllers/PairController";
import { Link } from '@inertiajs/react';
import PokemonData from '@/components/soullink/pokemon-data';


export default function PokemonPairEditor({pair, saveID, setLoadedPair}: {pair: any, saveID: number, setLoadedPair: (pair: any) => void}) {
  type pokemonDataType = {
    pokemon_one: {
      bst: number[];
      types: string[];
    };
    pokemon_two: {
      bst: number[];
      types: string[];
    };
  }
  // TODO: could move to onClick in PokemonPair, but this is fine for now
  const [pokemonData, setPokemonData] = useState<pokemonDataType>();
  useEffect(() => {
    if (pair) {
      console.log('pair changed', pair);
      fetch(`https://pokeapi.co/api/v2/pokemon/${pair.player_one_pokemon_name}`).then(response => response.json()).then(
            data => {
                let pokemon_one_data = {
                  bst: data.stats.map((stat: { base_stat: number }) => stat.base_stat),
                  types: [data.types[0].type.name, data.types[1] ? data.types[1].type.name : ''],
                }
                fetch(`https://pokeapi.co/api/v2/pokemon/${pair.player_two_pokemon_name}`).then(response => response.json()).then(
                  data2 => {
                    let pokemon_two_data = {
                      bst: data2.stats.map((stat: { base_stat: number }) => stat.base_stat),
                      types: [data2.types[0].type.name, data2.types[1] ? data2.types[1].type.name : ''],
                    }
                    setPokemonData({ pokemon_one: pokemon_one_data, pokemon_two: pokemon_two_data });
                  }
                );
            }
        );
    }
  }, [pair]);
  if (pair) {
    return (
      <section className="grow">
              <div>
                  <div className="px-4 pb-4 border-b border-black/20 flex justify-between">
                    <h2 className="text-center text-xl font-bold">
                      {pair.player_one_pokemon_nickname ? pair.player_one_pokemon_nickname : pair.player_one_pokemon_name} and {pair.player_two_pokemon_nickname ? pair.player_two_pokemon_nickname : pair.player_two_pokemon_name}
                    </h2>
                    <Link onClick={() => setLoadedPair(null)} className="hover:text-[#CC0000] cursor-pointer" method="delete" href={`/saves/${saveID}/pairs/${pair.id}`}>Kill Pair</Link>
                  </div>
                  <PokemonData name={pair.player_one_pokemon_name} data={pokemonData?.pokemon_one!} />
                  <PokemonData name={pair.player_two_pokemon_name} data={pokemonData?.pokemon_two!} />
              </div>
      </section>
    );
  } else {
    return (
      <section className="grow flex items-center justify-center">
        <p className="text-center">Click a pair to view/edit it</p>
      </section>
    );
  }
}
