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
  const [selectedPokemon, setSelectedPokemon] = useState<{ playerOne: string | null; playerTwo: string | null }>({ playerOne: null, playerTwo: null });
  return (
    <section className="w-md px-4 bg-contain bg-[url('https://raw.githubusercontent.com/domtronn/nuzlocke/refs/heads/master/src/assets/img/boxes/Grass.JPG')] bg-no-repeat border-x-1 border-x-black border-x-solid">
        <Dialog>
        <DialogTrigger className="bg-white/75 p-4 rounded-full cursor-pointer"><Plus /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-center">Add New Soullink Pair</DialogTitle>
            </DialogHeader>
            <Form className="flex flex-col justify-around">
              <div className="flex flex-row">
                <div className="p-4 mr-4 flex flex-col gap-3">
                  <h3 className="text-[#CC0000]">{save.player_one_name ? save.player_one_name : 'Player One'}</h3>
                  <Select /*onChange={option => setSelectedPokemon(prev => ({ ...prev, playerOne: option?.value || null }))}*/ name="playerOnePokemon"  options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                  <Input placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="text-[#3B4CCA]">{save.player_two_name ? save.player_two_name : 'Player Two'}</h3>
                  <Select /*onChange={option => setSelectedPokemon(prev => ({ ...prev, playerTwo: option?.value || null }))}*/ name="playerTwoPokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                  <Input placeholder="Nickname" id="playerTwoNickname" type="text" name="playerTwoNickname"></Input>
                </div>
              </div>
              <Button className="self-center">Add Pair</Button>
            </Form>
        </DialogContent>
        </Dialog>
    </section>
    
  );
}
