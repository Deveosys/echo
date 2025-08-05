import S3DestinationForm from '@/components/destinations/forms/s3-destination-form';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CreateDestinationFormData, Destination } from '@/types/destinations';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const types: Record<string, { label: string; value: Destination['destination_type_type'] }> = {
    s3: {
        label: 'S3',
        value: 'App\\Models\\S3Destination',
    },
    azure: {
        label: 'Azure',
        value: 'App\\Models\\AzureDestination',
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Destinations',
        href: route('destinations.index'),
    },
    {
        title: 'Create',
        href: route('destinations.create'),
    },
];

export default function DestinationsCreate() {
    const form = useForm<CreateDestinationFormData>({
        name: '',
        destination_type_type: types.s3.value,
        bucket_name: '',
        access_key_id: '',
        access_key_secret: '',
        region: '',
        endpoint: '',
        version: '',
        storage_account_name: '',
        storage_account_key: '',
        container_name: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.post(route('destinations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Destinations" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title="Create destination" description="Create a new destination" />
                <form onSubmit={handleSubmit}>
                    <div className="grid max-w-xl gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label>Name</Label>
                                <Input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                {form.errors.name && <p className="text-red-500">{form.errors.name}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label>Type</Label>
                                <Select
                                    value={form.data.destination_type_type}
                                    onValueChange={(value) => form.setData('destination_type_type', value as Destination['destination_type_type'])}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(types).map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.destination_type_type && <p className="text-red-500">{form.errors.destination_type_type}</p>}
                            </div>
                        </div>

                        {form.data.destination_type_type === types.s3.value && <S3DestinationForm form={form} />}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
