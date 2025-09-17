import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PokemonBox from '@/components/soullink/pokemon-box';

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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${save.name} - Soullink Tracker`} />
            <section></section>
            <PokemonBox boxPokemon={[]}/>
            <section></section>
        </AppLayout>
    );
}
