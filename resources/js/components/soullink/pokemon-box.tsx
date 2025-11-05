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
import { type PokemonPairType } from '@/types';
import { useLocalStorage} from 'usehooks-ts'
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';



interface PokemonBoxProps {
  livingBox: PokemonPairType[];
  deathBox: PokemonPairType[];
  setLoadedPair: (pair: PokemonPairType) => void;
  setPartyPairs: (pairs: (PokemonPairType | null)[]) => void;
  setUnavailableTypes: (types: string[]) => void;
  pokemonNames: string[];
  viewDeathBox: boolean;
  save: {
    id: number;
    name: string;
    player_one_name: string | null;
    player_two_name: string | null;
  };
  unavailableTypes: string[];
  highlightAvailablePairs: boolean;
  partyPairs: (PokemonPairType | null)[];
}


export default function PokemonBox({setUnavailableTypes, pokemonNames, save, setLoadedPair, viewDeathBox, livingBox, deathBox, unavailableTypes, highlightAvailablePairs,partyPairs, setPartyPairs }: PokemonBoxProps) {
  const [open, setOpen] = useState(false);
  const { auth } = usePage<SharedData>().props;
  const [pcBoxBackground, setPcBoxBackground] = useLocalStorage<number>(`pc-box-background-${auth.user.id}`, 0);

  function addToParty(event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) {
    event.stopPropagation();
    console.log(pair)
    const emptyIndex = partyPairs.findIndex((p) => p === null);
    if (emptyIndex !== -1 && !unavailableTypes.includes(pair.player_one_pokemon_primary_type) && !unavailableTypes.includes(pair.player_two_pokemon_primary_type) && !viewDeathBox) {
      const newPartyPairs = [...partyPairs];
      newPartyPairs[emptyIndex] = pair;
      setPartyPairs(newPartyPairs);
      setUnavailableTypes([...unavailableTypes, pair.player_one_pokemon_primary_type, pair.player_two_pokemon_primary_type]);
    }
  }
  
  return (
    <section style={{ backgroundImage: viewDeathBox ? 'url(/storage/deathbox.png)' : `url(/storage/pc-box-backgrounds/${pcBoxBackground}.png)` }} className="w-sm lg:w-2xl grow bg-center bg-no-repeat bg-cover overflow-y-auto rounded-t-xl">
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 justify-center lg:p-4 p-2"> 
        {/* TODO: allow users to sort box by primary/secondary type */}
        { livingBox.map((pair: PokemonPairType) => (
            <PokemonPair addToParty={addToParty} highlightAvailablePairs={highlightAvailablePairs} unavailableTypes={unavailableTypes} key={pair.id} pair={pair} setLoadedPair={setLoadedPair} viewDeathBox={viewDeathBox} />
        ))}
        { deathBox.map((pair: PokemonPairType) => (
            <PokemonPair addToParty={addToParty} key={pair.id} pair={pair} setLoadedPair={setLoadedPair} viewDeathBox={!viewDeathBox} />
        ))}
        <Dialog open={open} onOpenChange={setOpen}>

        <DialogTrigger name="AddPair" style={{ display: viewDeathBox ? 'none' : 'inline-block' }} className="bg-white/85 p-2 lg:p-4 cursor-pointer rounded-full justify-self-start self-center shadow-md"><Plus /></DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-center">Add a New Soullink Pair</DialogTitle>
            <DialogDescription className="text-center">Selected Pokemon Cannot Share the Same Primary Type</DialogDescription>
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
