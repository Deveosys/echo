import BackupForm from '@/components/backups/backup-form';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { BackupFormData, SourceTree, type CreateBackupFormData } from '@/types/backups';
import { Destination } from '@/types/destinations';
import { Head, InertiaFormProps, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Backups',
        href: route('backups.index'),
    },
    {
        title: 'Create',
        href: route('backups.create'),
    },
];

export default function BackupsCreate({ sourceTree, destinations }: { sourceTree: SourceTree; destinations: Destination[] }) {
    const form = useForm<CreateBackupFormData>({
        name: '',
        destination_id: -1,
        source_path: '',
        frequency: 'daily',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.post(route('backups.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Backups" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title="Create backup" description="Create a new backup" />
                <BackupForm
                    form={form as InertiaFormProps<BackupFormData>}
                    sourceTree={sourceTree}
                    destinations={destinations}
                    handleSubmit={handleSubmit}
                />
            </div>
        </AppLayout>
    );
}
