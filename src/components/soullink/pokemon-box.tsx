import InputError from '@/components/input-error';
import PokemonPair from '@/components/soullink/pokemon-pair';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppearance } from '@/hooks/use-appearance';
import { buildSelectStyles } from '@/lib/select-styles';
import { createPair } from '@/lib/storage';
import { type PokemonPairType, type SaveType } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import Select from 'react-select';
import { useLocalStorage } from 'usehooks-ts';

interface PokemonBoxProps {
    livingBox: PokemonPairType[];
    deathBox: PokemonPairType[];
    setLoadedPair: (pair: PokemonPairType) => void;
    setPartyPairs: (pairs: (PokemonPairType | null)[]) => void;
    setUnavailableTypes: (types: string[]) => void;
    pokemonNames: string[];
    viewDeathBox: boolean;
    save: SaveType;
    unavailableTypes: string[];
    highlightAvailablePairs: boolean;
    partyPairs: (PokemonPairType | null)[];
    locationOptions: { value: string; label: string }[];
}

export default function PokemonBox({
    setUnavailableTypes,
    pokemonNames,
    save,
    setLoadedPair,
    viewDeathBox,
    livingBox,
    deathBox,
    unavailableTypes,
    highlightAvailablePairs,
    partyPairs,
    setPartyPairs,
    locationOptions,
}: PokemonBoxProps) {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [pcBoxBackground] = useLocalStorage<number>('pc-box-background', 0);
    const { appearance } = useAppearance();
    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const selectStyles = buildSelectStyles(isDark);

    const usedLocations = new Set(
        [...livingBox, ...deathBox, ...partyPairs.filter((p): p is PokemonPairType => p !== null)]
            .map((p) => p.location)
            .filter((location): location is string => location !== null),
    );
    const availableLocationOptions = locationOptions.filter((option) => !usedLocations.has(option.value));

    function addToParty(event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) {
        event.stopPropagation();
        const emptyIndex = partyPairs.findIndex((p) => p === null);
        if (
            emptyIndex !== -1 &&
            !unavailableTypes.includes(pair.player_one_pokemon_primary_type) &&
            !unavailableTypes.includes(pair.player_two_pokemon_primary_type) &&
            !viewDeathBox
        ) {
            const newPartyPairs = [...partyPairs];
            newPartyPairs[emptyIndex] = pair;
            setPartyPairs(newPartyPairs);
            setUnavailableTypes([...unavailableTypes, pair.player_one_pokemon_primary_type, pair.player_two_pokemon_primary_type]);
        }
    }

    async function handleAddPair(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setProcessing(true);
        const result = await createPair(save, {
            playerOnePokemon: (formData.get('playerOnePokemon') as string) || null,
            playerTwoPokemon: (formData.get('playerTwoPokemon') as string) || null,
            playerOneNickname: (formData.get('playerOneNickname') as string) || null,
            playerTwoNickname: (formData.get('playerTwoNickname') as string) || null,
            location: (formData.get('location') as string) || null,
        });
        setProcessing(false);
        if (result.ok) {
            setErrors({});
            setOpen(false);
        } else {
            setErrors(result.errors);
        }
    }

    return (
        <section
            style={{ backgroundImage: viewDeathBox ? 'url(/storage/deathbox.png)' : `url(/storage/pc-box-backgrounds/${pcBoxBackground}.png)` }}
            className="w-sm grow overflow-y-auto rounded-xl bg-cover bg-center bg-no-repeat lg:w-2xl"
        >
            <div className="grid grid-cols-3 justify-center gap-4 p-2 lg:grid-cols-4 lg:p-4">
                {/* TODO: allow users to sort box by primary/secondary type */}
                {livingBox.map((pair: PokemonPairType) => (
                    <PokemonPair
                        addToParty={addToParty}
                        highlightAvailablePairs={highlightAvailablePairs}
                        unavailableTypes={unavailableTypes}
                        key={pair.id}
                        pair={pair}
                        setLoadedPair={setLoadedPair}
                        viewDeathBox={viewDeathBox}
                    />
                ))}
                {deathBox.map((pair: PokemonPairType) => (
                    <PokemonPair addToParty={addToParty} key={pair.id} pair={pair} setLoadedPair={setLoadedPair} viewDeathBox={!viewDeathBox} />
                ))}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger
                        name="AddPair"
                        style={{ display: viewDeathBox ? 'none' : 'inline-block' }}
                        className="cursor-pointer self-center justify-self-start rounded-full bg-white/85 p-2 shadow-md lg:p-4 dark:text-black"
                    >
                        <Plus />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-center">Add a New Soullink Pair</DialogTitle>
                            <DialogDescription className="text-center">Selected Pokemon Cannot Share the Same Primary Type</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddPair} className="flex flex-col justify-around">
                            <div className="flex flex-row">
                                <div className="mr-4 flex flex-col gap-3 p-4">
                                    <h3 className="text-[#CC0000]">{save.player_one_name ? save.player_one_name : 'Player One'}</h3>
                                    <Select
                                        tabIndex={1}
                                        required
                                        id="playerOnePokemon"
                                        name="playerOnePokemon"
                                        styles={selectStyles}
                                        options={pokemonNames?.map((name) => ({ value: name, label: name }))}
                                    />
                                    <InputError message={errors.playerOnePokemon} className="mt-2" />
                                    <Input tabIndex={2} placeholder="Nickname" id="playerOneNickname" type="text" name="playerOneNickname"></Input>
                                    <InputError message={errors.playerOneNickname} className="mt-2" />
                                </div>
                                <div className="flex flex-col gap-3 p-4">
                                    <h3 className="text-[#3B4CCA]">{save.player_two_name ? save.player_two_name : 'Player Two'}</h3>
                                    {/* TODO: select statement first character doesnt register */}
                                    <Select
                                        tabIndex={3}
                                        required
                                        id="playerTwoPokemon"
                                        name="playerTwoPokemon"
                                        styles={selectStyles}
                                        options={pokemonNames?.map((name) => ({ value: name, label: name }))}
                                    />
                                    <InputError message={errors.playerTwoPokemon} className="mt-2" />
                                    <Input tabIndex={4} placeholder="Nickname" id="playerTwoNickname" type="text" name="playerTwoNickname"></Input>
                                    <InputError message={errors.playerTwoNickname} className="mt-2" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2 px-4 pb-2">
                                <label htmlFor="location" className="text-sm">
                                    Caught Location <span className="text-muted-foreground">(optional)</span>
                                </label>
                                <div className="w-1/2">
                                    <Select
                                        tabIndex={5}
                                        isClearable
                                        id="location"
                                        name="location"
                                        placeholder="Select a location..."
                                        styles={selectStyles}
                                        options={availableLocationOptions}
                                    />
                                </div>
                                <InputError message={errors.location} className="mt-2 text-center" />
                            </div>
                            <InputError message={errors.samePrimaryType} className="mb-2 text-center" />
                            <Button tabIndex={6} type="submit" disabled={processing} className="self-center">
                                Add Pair
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
