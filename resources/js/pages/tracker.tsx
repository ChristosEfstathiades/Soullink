import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PokemonBox from '@/components/soullink/pokemon-box';
import PokemonParty from '@/components/soullink/pokemon-party';
import PokemonPairEditor from '@/components/soullink/pokemon-pair-editor';
import { useEffect, useState, useContext } from 'react';
import { index } from '@/routes/saves';

interface TrackerProps {
    save: {
        id: number;
        name: string;
        player_one_name: string | null;
        player_two_name: string | null;
    };
    boxPokemon: any[];
    deathBox: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: index().url,
    },
];

export default function Tracker({ save, boxPokemon, deathBox }: TrackerProps) {
    const [pokemonNames, setPokemonNames] = useState<string[]>([]);
    const [loadedPair, setLoadedPair] = useState<any | null>(null);
    const [viewDeathBox, setViewDeathBox] = useState(false);
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
                
            <PokemonParty />

            <section className='cursor-[url("/storage/PCHand.png"),_pointer] flex flex-col items-center h-[calc(100vh-4rem)]'>
                <div className='flex flex-row  border-b-0 border-black/20 rounded-t-xl'>
                    <button className='px-4 rounded-tl-xl' style={{ backgroundColor: viewDeathBox ? 'lightgray' : '#3B4CCA' }} onClick={() => { setViewDeathBox(false); }}>LivingBox</button>
                    <div className="w-px h-full bg-black/20"></div>
                    <button className='px-4 rounded-tr-xl' style={{ backgroundColor: viewDeathBox ? '#CC0000' : 'lightgray' }} onClick={() => { setViewDeathBox(true); }}>DeathBox</button>
                </div>
                {/* TODO: create seperate DeathBox component */}
                <PokemonBox setLoadedPair={setLoadedPair} save={save} pokemonNames={pokemonNames} viewDeathBox={viewDeathBox} livingBox={boxPokemon} deathBox={deathBox} />
            </section>

            <PokemonPairEditor setLoadedPair={setLoadedPair} saveID={save.id} pair={loadedPair} pokemonNames={pokemonNames} />
        </AppLayout>
    );
}
