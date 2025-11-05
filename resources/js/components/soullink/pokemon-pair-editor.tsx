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
import { type PokemonPairType } from '@/types';



type pokemonDataType = {
  pokemon_one: {
    bst: number[];
    types: string[];
  };
  pokemon_two: {
    bst: number[];
    types: string[];
  };
};


export default function PokemonPairEditor({pair, saveID, setLoadedPair, pokemonNames}: {pair: PokemonPairType | null, saveID: number, setLoadedPair: (pair: PokemonPairType | null) => void, pokemonNames?: string[]}) {
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
      <section className="">
        <div className="flex flex-col items-center">
            <div className="px-4 pt-1 pb-2 border-b border-black/20 flex justify-between w-full">
              <h2 className="text-center text-xl font-bold">
                {pair.player_one_pokemon_nickname ? pair.player_one_pokemon_nickname : pair.player_one_pokemon_name} and {pair.player_two_pokemon_nickname ? pair.player_two_pokemon_nickname : pair.player_two_pokemon_name}
              </h2>
              <button className="cursor-pointer" onClick={() => setLoadedPair(null)}><X /></button>
            </div>
            <PokemonData name={pair.player_one_pokemon_name} data={pokemonData?.pokemon_one!} />
            <PokemonData name={pair.player_two_pokemon_name} data={pokemonData?.pokemon_two!} />
            <Form resetOnSuccess className="flex flex-col justify-around items-center" method="put" action={update([saveID, pair.id])}>
              {({ errors }) => (
                <>
                  <div className="flex flex-row">
                    <div className="p-4 mr-4 flex flex-col gap-3">
                      <Select placeholder={pair.player_one_pokemon_name} tabIndex={1} id="playerOnePokemon" name="playerOnePokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerOnePokemon} className="mt-2" />
                      <Input tabIndex={2} placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
                      <InputError message={errors.playerOneNickname} className="mt-2" />
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <Select placeholder={pair.player_two_pokemon_name} tabIndex={3} id="playerTwoPokemon" name="playerTwoPokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
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
                  <div>
                    <Button tabIndex={5} type="submit" className="self-center cursor-pointer rounded-tr-none rounded-br-none ">Update Pair</Button>
                    <Link className="self-center cursor-pointer bg-[#e7000b] text-sm font-medium text-[#ffffff] py-2 px-4 rounded-md rounded-tl-none rounded-bl-none" onClick={() => setLoadedPair(null)} method="delete" href={`/saves/${saveID}/pairs/${pair.id}`}>Delete</Link>
                  </div>
                </>
              )}
            </Form>
        </div>
      </section>
    );
  } else {
    return (
      <section className=" flex items-center justify-center">
        <p className="text-center ml-4 w-22">Click a pair to view/edit</p>
      </section>
    );
  }
}
