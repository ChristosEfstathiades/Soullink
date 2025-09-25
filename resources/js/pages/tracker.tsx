import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PokemonBox from '@/components/soullink/pokemon-box';
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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: index().url,
    },
];

export default function Tracker({ save, boxPokemon }: TrackerProps) {
    const [pokemonNames, setPokemonNames] = useState<string[]>([]);
    const [loadedPair, setLoadedPair] = useState<any | null>(null);
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
            <Head title={`${save.name} - Soullink Tracker`} />
            <section></section>
            <PokemonBox setLoadedPair={setLoadedPair} save={save} pokemonNames={pokemonNames} boxPokemon={boxPokemon} />
            <PokemonPairEditor setLoadedPair={setLoadedPair} saveID={save.id} pair={loadedPair} pokemonNames={pokemonNames} />
        </AppLayout>
    );
}
