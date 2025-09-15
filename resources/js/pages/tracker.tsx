import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PokemonBox from '@/components/soullink/pokemon-box';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Tracker() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Soullink Tracker" />
            <section></section>
            <PokemonBox boxPokemon={[]}/>
            <section></section>
        </AppLayout>
    );
}
