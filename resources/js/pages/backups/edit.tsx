import BackupForm from '@/components/backups/backup-form';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Backup, BackupFormData, SourceTree, UpdateBackupFormData } from '@/types/backups';
import { Destination } from '@/types/destinations';
import { Head, InertiaFormProps, useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';
import { toast } from 'sonner';

export default function BackupsEdit({ backup, sourceTree, destinations }: { backup: Backup; sourceTree: SourceTree; destinations: Destination[] }) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                href: route('backups.index'),
                title: 'Backups',
            },
            {
                href: route('backups.show', backup),
                title: backup.name,
            },
            {
                href: route('backups.edit', backup),
                title: 'Edit',
            },
        ],
        [backup],
    );

    const form = useForm<UpdateBackupFormData>({
        id: backup.id,
        name: backup.name,
        destination_id: backup.destination.id,
        source_path: backup.source_path,
        frequency: backup.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.put(route('backups.update', backup), {
            onSuccess: () => {
                toast.success('Backup updated successfully');
            },
            onError: () => {
                toast.error('Failed to update backup');
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${backup.name} - Backups`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title={backup.name} description="Edit your backup" />

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
