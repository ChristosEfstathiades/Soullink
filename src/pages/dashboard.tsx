import SavesMenu from '@/components/soullink/saves-menu';
import { useDocumentTitle } from '@/hooks/use-document-title';
import AppLayout from '@/layouts/app-layout';
import { useSaves } from '@/lib/storage';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/saves',
    },
];

export default function Dashboard() {
    const saves = useSaves();
    useDocumentTitle('Saves');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SavesMenu saves={saves} />
        </AppLayout>
    );
}
