import InputError from '@/components/input-error';
import PokemonData from '@/components/soullink/pokemon-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppearance } from '@/hooks/use-appearance';
import { buildSelectStyles } from '@/lib/select-styles';
import { update } from '@/routes/saves/pairs';
import { type PokemonPairType } from '@/types';
import { Form, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Select from 'react-select';

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

export default function PokemonPairEditor({
    pair,
    saveID,
    setLoadedPair,
    pokemonNames,
    locationOptions = [],
}: {
    pair: PokemonPairType | null;
    saveID: number;
    setLoadedPair: (pair: PokemonPairType | null) => void;
    pokemonNames?: string[];
    locationOptions?: { value: string; label: string }[];
}) {
    // TODO: could move to onClick in PokemonPair, but this is fine for now
    const [pokemonData, setPokemonData] = useState<pokemonDataType>();
    const [isAlive, setIsAlive] = useState<boolean>(true);
    const { appearance } = useAppearance();
    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const selectStyles = buildSelectStyles(isDark, true);

    useEffect(() => {
        if (!pair) return;

        const controller = new AbortController();
        const fetchPokemon = (name: string) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal: controller.signal }).then((r) => {
                if (!r.ok) throw new Error(`PokeAPI responded with ${r.status} for "${name}"`);
                return r.json();
            });

        Promise.all([fetchPokemon(pair.player_one_pokemon_name), fetchPokemon(pair.player_two_pokemon_name)])
            .then(([data, data2]) => {
                setPokemonData({
                    pokemon_one: {
                        bst: data.stats.map((stat: { base_stat: number }) => stat.base_stat),
                        types: [data.types[0].type.name, data.types[1] ? data.types[1].type.name : ''],
                    },
                    pokemon_two: {
                        bst: data2.stats.map((stat: { base_stat: number }) => stat.base_stat),
                        types: [data2.types[0].type.name, data2.types[1] ? data2.types[1].type.name : ''],
                    },
                });
            })
            .catch((err: Error) => {
                if (err.name !== 'AbortError') {
                    console.error('Failed to load Pokémon data:', err);
                }
            });

        setIsAlive(pair.is_alive);
        return () => controller.abort();
    }, [pair]);
    if (pair) {
        return (
            <section className="">
                <div className="ml-2 flex flex-col items-center">
                    <div className="flex w-full justify-between border-b border-black/20 px-4 pt-1 pb-2 dark:border-white/20">
                        <div className="text-center">
                            <h2 className="text-xl font-bold">
                                {pair.player_one_pokemon_nickname ? pair.player_one_pokemon_nickname : pair.player_one_pokemon_name} and{' '}
                                {pair.player_two_pokemon_nickname ? pair.player_two_pokemon_nickname : pair.player_two_pokemon_name}
                            </h2>
                        </div>
                        <button className="cursor-pointer" onClick={() => setLoadedPair(null)}>
                            <X />
                        </button>
                    </div>
                    <PokemonData name={pair.player_one_pokemon_name} data={pokemonData?.pokemon_one!} />
                    <PokemonData name={pair.player_two_pokemon_name} data={pokemonData?.pokemon_two!} />
                    <Form resetOnSuccess className="flex flex-col items-center justify-around" method="put" action={update([saveID, pair.id])}>
                        {({ errors }) => (
                            <>
                                <div className="flex flex-row">
                                    <div className="flex flex-col gap-3 p-2 lg:p-4">
                                        <Select
                                            placeholder={pair.player_one_pokemon_name}
                                            tabIndex={1}
                                            id="playerOnePokemon"
                                            name="playerOnePokemon"
                                            styles={selectStyles}
                                            options={pokemonNames?.map((name) => ({ value: name, label: name }))}
                                        />
                                        <InputError message={errors.playerOnePokemon} className="mt-2" />
                                        <Input
                                            className="h-8 text-sm"
                                            tabIndex={2}
                                            placeholder="Nickname"
                                            id="playerOneNickname"
                                            type="text"
                                            name="playerOneNickname"
                                        ></Input>
                                        <InputError message={errors.playerOneNickname} className="mt-2" />
                                    </div>
                                    <div className="flex flex-col gap-3 p-2 lg:p-4">
                                        <Select
                                            placeholder={pair.player_two_pokemon_name}
                                            tabIndex={3}
                                            id="playerTwoPokemon"
                                            name="playerTwoPokemon"
                                            styles={selectStyles}
                                            options={pokemonNames?.map((name) => ({ value: name, label: name }))}
                                        />
                                        <InputError message={errors.playerTwoPokemon} className="mt-2" />
                                        <Input
                                            className="h-8 text-sm"
                                            tabIndex={4}
                                            placeholder="Nickname"
                                            id="playerTwoNickname"
                                            type="text"
                                            name="playerTwoNickname"
                                        ></Input>
                                        <InputError message={errors.playerTwoNickname} className="mt-2" />
                                    </div>
                                </div>
                                <div className="flex w-full flex-col items-center gap-2 px-2 pb-2 lg:px-4">
                                    <div className="flex w-full items-start justify-center gap-4">
                                        <div className="flex w-1/2 flex-col gap-2">
                                            <Label htmlFor="location">Caught Location</Label>
                                            <Select
                                                key={pair.id}
                                                tabIndex={5}
                                                isClearable
                                                id="location"
                                                name="location"
                                                placeholder="Select a location..."
                                                styles={selectStyles}
                                                defaultValue={pair.location ? { value: pair.location, label: pair.location } : undefined}
                                                options={locationOptions}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="isAlive">Alive</Label>
                                            <Input
                                                className="size-7 shadow-none"
                                                type="checkbox"
                                                id="isAlive"
                                                onChange={(e) => setIsAlive(e.target.checked)}
                                                name="isAlive"
                                                checked={isAlive}
                                            />
                                        </div>
                                    </div>
                                    <InputError message={errors.location} className="mt-2 text-center" />
                                </div>
                                <InputError message={errors.samePrimaryType} className="mb-2 text-center" />
                                <div>
                                    <Button
                                        tabIndex={6}
                                        type="submit"
                                        className="cursor-pointer self-center rounded-tr-none rounded-br-none dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                                    >
                                        Update Pair
                                    </Button>
                                    <Link
                                        className="cursor-pointer self-center rounded-md rounded-tl-none rounded-bl-none bg-[#e7000b] px-4 py-2 text-sm font-medium text-[#ffffff]"
                                        onClick={() => setLoadedPair(null)}
                                        method="delete"
                                        href={`/saves/${saveID}/pairs/${pair.id}`}
                                    >
                                        Delete
                                    </Link>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </section>
        );
    } else {
        return (
            <section className="flex items-center justify-center">
                <p className="ml-4 w-22 text-center">Click a pair to view/edit</p>
            </section>
        );
    }
}
