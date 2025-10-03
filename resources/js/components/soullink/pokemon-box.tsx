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




interface PokemonBoxProps {
  boxPokemon: any[];
  setLoadedPair?: (pair: any) => void;
  pokemonNames?: string[];
  save: {
    id: number;
    name: string;
    player_one_name: string | null;
    player_two_name: string | null;
  };
}

export default function PokemonBox({boxPokemon, pokemonNames, save, setLoadedPair }: PokemonBoxProps) {
  const [open, setOpen] = useState(false);
  return (
    <section className="w-2xl grow bg-center bg-[url('https://s3.pokeos.com/pokeos-uploads/art-archive/Games/Pok%C3%A9mon%20HOME/Profile%20Wallpapers/0011.png')] bg-no-repeat">
      <div className="flex p-[22px] gap-4 flex-wrap">
        { boxPokemon.map((pair: any) => (
          <PokemonPair pair={pair} key={pair.id} setLoadedPair={setLoadedPair} />
        ))}
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="bg-white/75 p-4 rounded-full cursor-pointer self-center shadow-md"><Plus /></DialogTrigger>
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
                      <Select tabIndex={3} required id="playerTwoPokemon" name="playerTwoPokemon" options={pokemonNames?.map(name => ({ value: name, label: name }))} />
                      <InputError message={errors.playerTwoPokemon} className="mt-2" />
                      <Input tabIndex={4} placeholder="Nickname" id="playerTwoNickname" type="text" name="playerTwoNickname"></Input>
                      <InputError message={errors.playerTwoNickname} className="mt-2" />
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
