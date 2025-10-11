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
import {X} from 'lucide-react';



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
  const [isAlive, setIsAlive] = useState<boolean>(true);
  useEffect(() => {
    if (pair) {
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
      setIsAlive(pair.is_alive === 1 ? true : false);
    }
  }, [pair]);
  if (pair) {
    return (
      <section className="grow">
        <div className="flex flex-col items-center">
            <div className="px-4 pt-1 pb-4 border-b border-black/20 flex justify-between w-full">
              <h2 className="text-center text-xl font-bold">
                {pair.player_one_pokemon_nickname ? pair.player_one_pokemon_nickname : pair.player_one_pokemon_name} and {pair.player_two_pokemon_nickname ? pair.player_two_pokemon_nickname : pair.player_two_pokemon_name}
              </h2>
              <button className="cursor-pointer" onClick={() => setLoadedPair(null)}><X /></button>
            </div>
            <PokemonData name={pair.player_one_pokemon_name} data={pokemonData?.pokemon_one!} />
            <PokemonData name={pair.player_two_pokemon_name} data={pokemonData?.pokemon_two!} />
            <Form resetOnSuccess className="flex flex-col justify-around" method="put" action={update([saveID, pair.id])}>
              {/* TODO: pair doesnt update after form submission. Could pass boxpokemon as prop and add it to useEffect or create onSuccess handler that fetches updates pair from boxPokemon*/}
              {({ errors }) => (
                <>
                  <div className="flex flex-row">
                    <div className="p-4 mr-4 flex flex-col gap-3">
                      <h3 className="text-[#CC0000]">{pair.player_one_name}</h3>
                      <Select tabIndex={1} defaultValue={pair.player_one_pokemon_name} id="playerOnePokemon" name="playerOnePokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerOnePokemon} className="mt-2" />
                      <Input tabIndex={2} placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
                      <InputError message={errors.playerOneNickname} className="mt-2" />
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <h3 className="text-[#3B4CCA]">{pair.player_two_name}</h3>
                      <Select tabIndex={3} defaultValue={pair.player_two_pokemon_name} id="playerTwoPokemon" name="playerTwoPokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerTwoPokemon} className="mt-2" />
                      <Input tabIndex={4} placeholder="Nickname" id="playerTwoNickname" type="text" name="playerTwoNickname"></Input>
                      <InputError message={errors.playerTwoNickname} className="mt-2" />
                    </div>
                    <div className="p-4 flex flex-col justify-center items-start">
                      <Label htmlFor="isAlive">Alive</Label>
                      <Input className="shadow-none" type="checkbox" id="isAlive" onChange={e => setIsAlive(e.target.checked)} name="isAlive" checked={isAlive} />
                    </div>
                  </div>
                  <InputError message={errors.samePrimaryType} className="mb-2 text-center" />
                  <Button tabIndex={5} type="submit" className="self-center cursor-pointer">Update Pair</Button>
                  <Button className="self-center mt-4 cursor-pointer" variant='destructive'>
                    <Link onClick={() => setLoadedPair(null)} className="cursor-pointer" method="delete" href={`/saves/${saveID}/pairs/${pair.id}`}>Delete</Link>
                  </Button>
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
