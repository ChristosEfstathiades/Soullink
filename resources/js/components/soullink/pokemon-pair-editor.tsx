import { useEffect, useState } from "react";
import { LoaderCircle } from 'lucide-react';
import { Link, Form } from '@inertiajs/react';
import PokemonData from '@/components/soullink/pokemon-data';
import { update } from "@/routes/saves/pairs";
import Select from 'react-select'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError  from '@/components/input-error';


export default function PokemonPairEditor({pair, saveID, setLoadedPair, pokemonNames}: {pair: any, saveID: number, setLoadedPair: (pair: any) => void, pokemonNames?: string[]}) {
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
            <Form className="flex flex-col justify-around" method="put" action={update([saveID, pair.id])}>
              {({ errors }) => (
                <>
                  <div className="flex flex-row">
                    <div className="p-4 mr-4 flex flex-col gap-3">
                      <h3 className="text-[#CC0000]">{pair.player_one_name}</h3>
                      <Select tabIndex={1} defaultValue={pair.player_one_pokemon_name} required id="playerOnePokemon" name="playerOnePokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerOnePokemon} className="mt-2" />
                      <Input tabIndex={2} placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
                      <InputError message={errors.playerOneNickname} className="mt-2" />
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <h3 className="text-[#3B4CCA]">{pair.player_two_name}</h3>
                      <Select tabIndex={3} defaultValue={pair.player_two_pokemon_name} required id="playerTwoPokemon" name="playerTwoPokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerTwoPokemon} className="mt-2" />
                      <Input tabIndex={4} placeholder="Nickname" id="playerTwoNickname" type="text" name="playerTwoNickname"></Input>
                      <InputError message={errors.playerTwoNickname} className="mt-2" />
                    </div>
                  </div>
                  <Button tabIndex={5} type="submit" className="self-center">Update Pair</Button>
                </>
              )}
            </Form>
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
