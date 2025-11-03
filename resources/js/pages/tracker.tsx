import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PokemonPairType } from '@/types';
import { Head } from '@inertiajs/react';
import PokemonBox from '@/components/soullink/pokemon-box';
import PokemonPairEditor from '@/components/soullink/pokemon-pair-editor';
import TeamBuilder from '@/components/soullink/team-builder';
import { useEffect, useState, useContext } from 'react';
import { index } from '@/routes/saves';
import { Input } from '@/components/ui/input';
import { useLocalStorage} from 'usehooks-ts'

interface TrackerProps {
    save: {
        id: number;
        name: string;
        player_one_name: string | null;
        player_two_name: string | null;
    };
    livingBox: PokemonPairType[];
    deathBox: PokemonPairType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Saves',
        href: index().url,
    },
];

function currentPartyPairTypes(partyPairs: (PokemonPairType | null)[]): string[] {
    const types: string[] = [];
    partyPairs.forEach(pair => {
        if (pair) {
            types.push(pair.player_one_pokemon_primary_type, pair.player_two_pokemon_primary_type);
        }
    })
    return types;
}

export default function Tracker({ save, livingBox, deathBox }: TrackerProps) {
    const [pokemonNames, setPokemonNames] = useState<string[]>([]);
    const [loadedPair, setLoadedPair] = useState<PokemonPairType | null>(null);
    const [viewDeathBox, setViewDeathBox] = useState(false);
    const [partyPairs, setPartyPairs, removePartyPairs] = useLocalStorage<(PokemonPairType | null)[]>(`${save.name}-${save.id}`, Array(6).fill(null));
    const [unavailableTypes, setUnavailableTypes] = useState<string[]>(currentPartyPairTypes(partyPairs)); 
    const [highlightAvailablePairs, setHighlightAvailablePairs] = useState(false);
    const filteredBox = livingBox.filter(
        p => !partyPairs.some(slot => slot?.id === p.id)
    );

    // TODO: replace with react-query
    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=1301').then(response => response.json()).then(
            data => {
                setPokemonNames(data.results.map((pokemon: { name: string }) => pokemon.name));
            }
        );
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${save.name} - Soullink Tracker`} >
                <link rel="preload" href="/storage/livingbox.png" as="image"></link>
                <link rel="preload" href="/storage/deathbox.png" as="image"></link>
            </Head>
            <TeamBuilder removePartyPairs={removePartyPairs} save={save} unavailableTypes={unavailableTypes} setUnavailableTypes={setUnavailableTypes} setPartyPairs={setPartyPairs} livingBox={livingBox} partyPairs={partyPairs} />

            <section className='cursor-[url("/storage/PCHand.png"),_pointer] flex flex-col items-center h-[calc(100vh-4rem)]'>
                <div className='flex rounded-t-xl'>
                    <button className='px-4 py-1 cursor-[inherit] rounded-tl-xl' style={{ backgroundColor: viewDeathBox ? '#eee' : '#23CD5E' }} onClick={() => { setViewDeathBox(false); }}>{save.name} Box</button>
                    <div className="w-px h-full bg-black/30"></div>
                    <button className='px-4 py-1 cursor-[inherit] rounded-tr-xl' style={{ backgroundColor: viewDeathBox ? '#F34444' : '#eee' }} onClick={() => { setViewDeathBox(true); }}>Death Box</button>
                </div>
                <PokemonBox setUnavailableTypes={setUnavailableTypes} highlightAvailablePairs={highlightAvailablePairs} unavailableTypes={unavailableTypes} setLoadedPair={setLoadedPair} save={save} pokemonNames={pokemonNames} viewDeathBox={viewDeathBox} livingBox={filteredBox} setPartyPairs={setPartyPairs} partyPairs={partyPairs} deathBox={deathBox} />
                <div className='mt-3 mb-3 flex items-center gap-4'>
                    <div className='flex items-center'>
                        <input name='highlightAvailablePairs' className='size-7 mr-1' onChange={e => setHighlightAvailablePairs(e.target.checked)} type="checkbox"/>
                        <label htmlFor='highlightAvailablePairs'>Highlight Available Pairs</label>
                    </div>
                </div>

            </section>

            <PokemonPairEditor  setLoadedPair={setLoadedPair} saveID={save.id} pair={loadedPair} pokemonNames={pokemonNames} />
        </AppLayout>
    );
}
