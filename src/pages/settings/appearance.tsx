import HeadingSmall from '@/components/heading-small';
import PCBoxBackgroundOptions from '@/components/soullink/pc-box-background-options';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    useDocumentTitle('Appearance settings');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="PC box wallpaper" description="Change the wallpaper of your PC Box" />
                    <PCBoxBackgroundOptions />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
