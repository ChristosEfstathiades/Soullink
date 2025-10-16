import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Plus} from 'lucide-react';
import { useState } from "react";
import { Form } from '@inertiajs/react';
import Select from 'react-select'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError  from '@/components/input-error';
import { store } from '@/actions/App/Http/Controllers/PairController';
import PokemonPair from '@/components/soullink/pokemon-pair';
import {useDraggable} from '@dnd-kit/core';




interface PokemonBoxProps {
  livingBox: any[];
  deathBox: any[];
  setLoadedPair: (pair: any) => void;
  pokemonNames: string[];
  viewDeathBox: boolean;
  save: {
    id: number;
    name: string;
    player_one_name: string | null;
    player_two_name: string | null;
  };
}

export default function PokemonBox({pokemonNames, save, setLoadedPair, viewDeathBox, livingBox, deathBox }: PokemonBoxProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <section style={{ backgroundImage: !viewDeathBox ? 'url(/storage/livingbox.png)' : 'url(/storage/deathbox.png)' }} className="w-sm lg:w-2xl grow bg-center bg-no-repeat bg-cover overflow-y-auto">
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 justify-center lg:p-4 p-2"> 
        {/* TODO: When users are team building provide option to only display valid pairs that can be added */}
        {/* TODO: allow users to sort box by primary/secondary type */}
        {/* TODO: allow users to only display unique pairs. a unique pair is pair whos two typings arent shared by another pairs */}
        {/* TODO: Optional: convert to carousel with shadcn */}
        { livingBox.map((pair: any) => (
            <PokemonPair key={pair.id} pair={pair} setLoadedPair={setLoadedPair} viewDeathBox={viewDeathBox} />
        ))}
        { deathBox.map((pair: any) => (
            <PokemonPair key={pair.id} pair={pair} setLoadedPair={setLoadedPair} viewDeathBox={!viewDeathBox} />
        ))}
        <Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger style={{ display: viewDeathBox ? 'inline-block' : 'inline-block' }} className="bg-white/85 p-2 lg:p-4 cursor-[url('/storage/PCHand.png'),_pointer] rounded-full justify-self-start self-center shadow-md"><Plus /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-center">Add New Soullink Pair</DialogTitle>
            </DialogHeader>
            <Form onSuccess={() => setOpen(false)} action={store(save.id)} className="flex flex-col justify-around">
              {({ errors }) => (
                <>
                  <div className="flex flex-row">
                    <div className="p-4 mr-4 flex flex-col gap-3">
                      <h3 className="text-[#CC0000]">{save.player_one_name ? save.player_one_name : 'Player One'}</h3>
                      <Select tabIndex={1} required id="playerOnePokemon" name="playerOnePokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerOnePokemon} className="mt-2" />
                      <Input tabIndex={2} placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
                      <InputError message={errors.playerOneNickname} className="mt-2" />
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <h3 className="text-[#3B4CCA]">{save.player_two_name ? save.player_two_name : 'Player Two'}</h3>
                      {/* TODO: select statement first character doesnt register */}
                      <Select tabIndex={3} required id="playerTwoPokemon" name="playerTwoPokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerTwoPokemon} className="mt-2" />
                      <Input tabIndex={4} placeholder="Nickname" id="playerTwoNickname" type="text" name="playerTwoNickname"></Input>
                      <InputError message={errors.playerTwoNickname} className="mt-2" />
                    </div>
                  </div>
                  <InputError message={errors.samePrimaryType} className="mb-2 text-center" />
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
