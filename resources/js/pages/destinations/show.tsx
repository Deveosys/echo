import ShowS3Destination from '@/components/destinations/show-s3-destination';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Destination, S3Destination } from '@/types/destinations';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';

export default function DestinationsShow({ destination }: { destination: Destination }) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Destinations',
                href: route('destinations.index'),
            },
            {
                title: destination.name,
                href: route('destinations.show', destination),
            },
        ],
        [destination],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={destination.name} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title={destination.name} description="Manage your destination" />
                <Card>
                    <CardContent className="grid gap-2">
                        {destination.destination_type_type === 'App\\Models\\S3Destination' && (
                            <ShowS3Destination s3Destination={destination as S3Destination} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
