import SavesMenu from '@/components/soullink/saves-menu';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/saves';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: index().url,
    },
];

export default function Dashboard({ saves }: { saves: any[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Saves" />
            <SavesMenu saves={saves} />
        </AppLayout>
    );
}
