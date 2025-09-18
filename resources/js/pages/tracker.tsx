import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PokemonBox from '@/components/soullink/pokemon-box';
import { useEffect, useState } from 'react';

interface TrackerProps {
    save: {
        id: number;
        name: string;
        player_one_name: string | null;
        player_two_name: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Tracker({ save }: TrackerProps) {
    const [pokemonNames, setPokemonNames] = useState<string[]>([]);
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
            <section>
            </section>
            <PokemonBox boxPokemon={[]} />
            <section></section>
        </AppLayout>
    );
}
