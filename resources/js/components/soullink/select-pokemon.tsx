import Select from 'react-select'
import { Input } from '@/components/ui/input';


interface SelectPokemonProps {
  pokemonNames: string[];
  save: {
    id: number;
    name: string;
    player_one_name: string | null;
    player_two_name: string | null;
  };
}

export default function SelectPokemon({ pokemonNames, save }: SelectPokemonProps) {
  return (
    <div className=" p-4 mr-4 flex flex-col gap-3">
        <h3 className="text-[#CC0000]">{save.player_one_name ? save.player_one_name : 'Player One'}</h3>
        <Select name="playerOnePokemon"  options={pokemonNames?.map(name => ({ value: name, label: name }))} />
        <Input placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
    </div>
  );
}
