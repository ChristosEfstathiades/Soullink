import { useEffect, useState } from "react";
import { LoaderCircle } from 'lucide-react';
import { log } from "console";
import { destroy } from "@/actions/App/Http/Controllers/PairController";
import { Link } from '@inertiajs/react';


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
                  <div>
                    <h2 className="text-center text-xl font-bold border-b border-black">
                      {pair.player_one_pokemon_nickname ? pair.player_one_pokemon_nickname : pair.player_one_pokemon_name} and {pair.player_two_pokemon_nickname ? pair.player_two_pokemon_nickname : pair.player_two_pokemon_name}
                    </h2>
                    <Link onClick={() => setLoadedPair(null)} className="hover:text-[#CC0000] cursor-pointer" method="delete" href={`/saves/${saveID}/pairs/${pair.id}`}>Kill Pair</Link>

                  </div>
                  {/* <LoaderCircle className="h-16 w-16 animate-spin" /> */}
                  <div>
                    <div className="flex items-center">
                      <img draggable="false" className="w-40 mr-4" src={`/storage/${pair.player_one_pokemon_name}.png`} alt={pair.player_one_pokemon_name} />
                      <ul className="text-xs">
                        <li>hp {pokemonData?.pokemon_one.bst[0]}</li>
                        <li>atk</li>
                        <li>def</li>
                        <li>spa</li>
                        <li>spd</li>
                        <li>spe</li>
                      </ul>
                    </div>

                  </div>

                  <div className="flex items-center">
                      <img draggable="false" className="w-40 mr-4" src={`/storage/${pair.player_two_pokemon_name}.png`} alt={pair.player_two_pokemon_name} />
                      <ul className="text-xs">
                        <li>hp</li>
                        <li>atk</li>
                        <li>def</li>
                        <li>spa</li>
                        <li>spd</li>
                        <li>spe</li>
                      </ul>
                    </div>
              </div>
      </section>
    );
  } else {
    return (
      <section className="grow flex items-center justify-center">
        <p className="text-center">Click a pair to edit it</p>
      </section>
    );
  }
}
