import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Backup } from '@/types/backups';
import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';

export default function BackupsShow({ backup }: { backup: Backup }) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Backups',
                href: route('backups.index'),
            },
            {
                title: backup.name,
                href: route('backups.show', backup),
            },
        ],
        [backup],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={backup.name} />
            <div className="p-4">
                <Heading title={backup.name} description="Manage your backup" />
                <div className="mx-auto grid w-full max-w-7xl gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center justify-between gap-2">
                                    <span>{backup.name}</span>
                                    <div className="flex gap-2">
                                        <Button asChild variant="link" size="sm">
                                            <Link method="delete" href={route('backups.destroy', backup)}>
                                                Delete
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={route('backups.edit', backup)}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label>Destination</Label>
                                    <p>{backup.destination.name}</p>
                                </div>

                                <div className="col-span-2">
                                    <Label>Frequency</Label>
                                    <p>{backup.frequency}</p>
                                </div>

                                <div className="col-span-2">
                                    <Label>Max Backup Instances</Label>
                                    <p>{backup.max_backup_instances}</p>
                                </div>

                                <div className="col-span-2">
                                    <Label>Source</Label>
                                    <p>{backup.source_path}</p>
                                </div>

                                <div className="col-span-2 flex gap-2">
                                    <Button asChild>
                                        <Link href={route('backups.execute', backup)}>Execute</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <h3 className="text-lg font-bold">Backup Instances ({backup.backup_instances.length})</h3>
                    {backup.backup_instances.length === 0 && (
                        <Card>
                            <CardContent>
                                <p>No backup instances found</p>
                            </CardContent>
                        </Card>
                    )}
                    {backup.backup_instances.map((backupInstance) => (
                        <Card key={backupInstance.id}>
                            <CardHeader>
                                <CardTitle>
                                    <Badge
                                        variant={
                                            backupInstance.status === 'completed'
                                                ? 'success'
                                                : backupInstance.status === 'failed'
                                                  ? 'destructive'
                                                  : 'default'
                                        }
                                    >
                                        {backupInstance.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                {backupInstance.key_name && (
                                    <div>
                                        <p className="font-semibold">File path</p>
                                        <p>{backupInstance.key_name}</p>
                                    </div>
                                )}
                                {backupInstance.error && (
                                    <div>
                                        <p className="font-semibold">Error</p>
                                        <p> {backupInstance.error}</p>
                                    </div>
                                )}
                                {backupInstance.started_at && (
                                    <div>
                                        <p className="font-semibold">Started at</p>
                                        <p> {new Date(backupInstance.started_at).toLocaleString()}</p>
                                    </div>
                                )}
                                {backupInstance.completed_at && (
                                    <div>
                                        <p className="font-semibold">Completed at</p>
                                        <p> {new Date(backupInstance.completed_at).toLocaleString()}</p>
                                    </div>
                                )}
                                {backupInstance.failed_at && (
                                    <div>
                                        <p className="font-semibold">Failed at</p>
                                        <p> {new Date(backupInstance.failed_at).toLocaleString()}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
