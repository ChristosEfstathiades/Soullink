import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import PokemonBox from '@/components/soullink/pokemon-box';
import SavesMenu from "@/components/soullink/saves-menu";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({saves}: {saves: any[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Saves" />
            <SavesMenu saves={saves} />
        </AppLayout>
    );
}
