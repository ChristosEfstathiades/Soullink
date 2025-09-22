import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Select from 'react-select'
import {Plus} from 'lucide-react';
import { useState } from "react";
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { store } from '@/actions/App/Http/Controllers/PairController';
import InputError  from '@/components/input-error';




interface PokemonBoxProps {
  boxPokemon: any[];
  pokemonNames?: string[];
  save: {
    id: number;
    name: string;
    player_one_name: string | null;
    player_two_name: string | null;
  };
}

export default function PokemonBox({ boxPokemon, pokemonNames, save }: PokemonBoxProps) {
  return (
    <section className="w-md px-4 bg-contain bg-[url('https://raw.githubusercontent.com/domtronn/nuzlocke/refs/heads/master/src/assets/img/boxes/Grass.JPG')] bg-no-repeat border-x-1 border-x-black border-x-solid">
      <div className="flex gap-4">
        { boxPokemon.map((pair: any) => (
          <div className="flex bg-white rounded-2xl" key={pair.id}>
            <img className="w-25" src={`https://img.pokemondb.net/artwork/${pair.player_one_pokemon_name}.jpg`} alt={pair.player_one_pokemon_name} />
            <img className="w-25" src={`https://img.pokemondb.net/artwork/${pair.player_two_pokemon_name}.jpg`} alt={pair.player_two_pokemon_name} />
          </div>
        ))}
        <Dialog>
        <DialogTrigger className="bg-white/75 p-4 rounded-full cursor-pointer"><Plus /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-center">Add New Soullink Pair</DialogTitle>
            </DialogHeader>
            <Form action={store(save.id)} className="flex flex-col justify-around">
              {({ errors }) => (
                <>
                  <div className="flex flex-row">
                    <div className="p-4 mr-4 flex flex-col gap-3">
                      <h3 className="text-[#CC0000]">{save.player_one_name ? save.player_one_name : 'Player One'}</h3>
                      <Select tabIndex={1} required id="playerOnePokemon" name="playerOnePokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerOnePokemon} className="mt-2" />
                      <Input tabIndex={2} placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <h3 className="text-[#3B4CCA]">{save.player_two_name ? save.player_two_name : 'Player Two'}</h3>
                      <Select tabIndex={3} required id="playerTwoPokemon" name="playerTwoPokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerTwoPokemon} className="mt-2" />
                      <Input tabIndex={4} placeholder="Nickname" id="playerTwoNickname" type="text" name="playerTwoNickname"></Input>
                    </div>
                  </div>
                  <Button tabIndex={5} type="submit" className="self-center">Add Pair</Button>
                </>
              )}
            </Form>
        </DialogContent>
        </Dialog>
      </div>
    </section>
    
  );
}
