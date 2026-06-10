import PokemonBox from '@/components/soullink/pokemon-box';
import PokemonPairEditor from '@/components/soullink/pokemon-pair-editor';
import TeamBuilder from '@/components/soullink/team-builder';
import { useAppearance } from '@/hooks/use-appearance';
import { useDocumentTitle } from '@/hooks/use-document-title';
import AppLayout from '@/layouts/app-layout';
import { useSave, useSavePairs } from '@/lib/storage';
import { type BreadcrumbItem, type PokemonPairType, type SaveType } from '@/types';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Saves',
        href: '/saves',
    },
];

function currentPartyPairTypes(partyPairs: (PokemonPairType | null)[]): string[] {
    const types: string[] = [];
    partyPairs.forEach((pair) => {
        if (pair) {
            types.push(pair.player_one_pokemon_primary_type, pair.player_two_pokemon_primary_type);
        }
    });
    return types;
}

function formatLocationName(name: string): string {
    return name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function Tracker() {
    const { saveId } = useParams();
    const save = useSave(Number(saveId));
    const pairs = useSavePairs(save?.id);

    if (!save) {
        return <Navigate to="/saves" replace />;
    }

    return (
        <TrackerView key={save.id} save={save} livingBox={pairs.filter((pair) => pair.is_alive)} deathBox={pairs.filter((pair) => !pair.is_alive)} />
    );
}

interface TrackerViewProps {
    save: SaveType;
    livingBox: PokemonPairType[];
    deathBox: PokemonPairType[];
}

function TrackerView({ save, livingBox, deathBox }: TrackerViewProps) {
    const [pokemonNames, setPokemonNames] = useState<string[]>([]);
    const [locationOptions, setLocationOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadedPair, setLoadedPair] = useState<PokemonPairType | null>(null);
    const [viewDeathBox, setViewDeathBox] = useState(false);
    const [partyPairs, setPartyPairs, removePartyPairs] = useLocalStorage<(PokemonPairType | null)[]>(`${save.name}-${save.id}`, Array(6).fill(null));
    const [unavailableTypes, setUnavailableTypes] = useState<string[]>(currentPartyPairTypes(partyPairs));
    const [highlightAvailablePairs, setHighlightAvailablePairs] = useState(false);
    const filteredBox = livingBox.filter((p) => !partyPairs.some((slot) => slot?.id === p.id));
    const { appearance } = useAppearance();
    useDocumentTitle(`${save.name} - Soullink Tracker`);

    useEffect(() => {
        const controller = new AbortController();
        fetch('https://pokeapi.co/api/v2/pokemon?limit=1301', { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error(`PokeAPI responded with ${response.status}`);
                return response.json();
            })
            .then((data) => {
                setPokemonNames(data.results.map((pokemon: { name: string }) => pokemon.name));
            })
            .catch((err: Error) => {
                if (err.name !== 'AbortError') {
                    console.error('Failed to load Pokémon list:', err);
                }
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetch('https://pokeapi.co/api/v2/location?limit=2000', { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error(`PokeAPI responded with ${response.status}`);
                return response.json();
            })
            .then((data) => {
                const options = data.results
                    .map((location: { name: string }) => formatLocationName(location.name))
                    .sort((a: string, b: string) => a.localeCompare(b))
                    .map((name: string) => ({ value: name, label: name }));
                setLocationOptions(options);
            })
            .catch((err: Error) => {
                if (err.name !== 'AbortError') {
                    console.error('Failed to load location list:', err);
                }
            });
        return () => controller.abort();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TeamBuilder
                removePartyPairs={removePartyPairs}
                save={save}
                unavailableTypes={unavailableTypes}
                setUnavailableTypes={setUnavailableTypes}
                setPartyPairs={setPartyPairs}
                livingBox={livingBox}
                partyPairs={partyPairs}
            />

            <section className='flex h-[calc(100vh-4rem)] cursor-[url("/storage/PCHand.png"),_pointer] flex-col items-center'>
                <div className="flex rounded-t-xl">
                    <button
                        className="cursor-[inherit] rounded-tl-xl px-4 py-1 dark:text-black"
                        style={{ backgroundColor: viewDeathBox ? '#eee' : '#23CD5E' }}
                        onClick={() => {
                            setViewDeathBox(false);
                        }}
                    >
                        {save.name} Box
                    </button>
                    <div className="h-full w-px bg-black/30"></div>
                    <button
                        className="cursor-[inherit] rounded-tr-xl px-4 py-1 dark:text-white"
                        style={{
                            backgroundColor: viewDeathBox
                                ? '#F34444'
                                : appearance === 'dark' ||
                                    (appearance === 'system' &&
                                        typeof window !== 'undefined' &&
                                        window.matchMedia('(prefers-color-scheme: dark)').matches)
                                  ? '#27272a'
                                  : '#eee',
                        }}
                        onClick={() => {
                            setViewDeathBox(true);
                        }}
                    >
                        Death Box
                    </button>
                </div>
                <PokemonBox
                    setUnavailableTypes={setUnavailableTypes}
                    highlightAvailablePairs={highlightAvailablePairs}
                    unavailableTypes={unavailableTypes}
                    setLoadedPair={setLoadedPair}
                    save={save}
                    pokemonNames={pokemonNames}
                    locationOptions={locationOptions}
                    viewDeathBox={viewDeathBox}
                    livingBox={filteredBox}
                    setPartyPairs={setPartyPairs}
                    partyPairs={partyPairs}
                    deathBox={deathBox}
                />
                <div className="mt-3 mb-3 flex items-center gap-4">
                    <div className="flex items-center">
                        <input
                            name="highlightAvailablePairs"
                            className="mr-1 size-7 accent-[#3B4CCA]"
                            onChange={(e) => setHighlightAvailablePairs(e.target.checked)}
                            type="checkbox"
                        />
                        <label htmlFor="highlightAvailablePairs">Highlight Available Pairs</label>
                    </div>
                </div>
            </section>

            <PokemonPairEditor
                setLoadedPair={setLoadedPair}
                save={save}
                pair={loadedPair}
                pokemonNames={pokemonNames}
                locationOptions={locationOptions}
            />
        </AppLayout>
    );
}
