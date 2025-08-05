import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateDestinationFormData } from '@/types/destinations';
import { useForm } from '@inertiajs/react';

export default function S3DestinationForm({ form }: { form: ReturnType<typeof useForm<CreateDestinationFormData>> }) {
    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label>Bucket name</Label>
                    <Input type="text" value={form.data.bucket_name} onChange={(e) => form.setData('bucket_name', e.target.value)} />
                    {form.errors.bucket_name && <p className="text-red-500">{form.errors.bucket_name}</p>}
                </div>
                <div className="col-span-2">
                    <Label>Endpoint</Label>
                    <Input type="text" value={form.data.endpoint} onChange={(e) => form.setData('endpoint', e.target.value)} />
                    {form.errors.endpoint && <p className="text-red-500">{form.errors.endpoint}</p>}
                </div>
                <div className="col-span-2">
                    <Label>Access key ID</Label>
                    <Input type="text" value={form.data.access_key_id} onChange={(e) => form.setData('access_key_id', e.target.value)} />
                    {form.errors.access_key_id && <p className="text-red-500">{form.errors.access_key_id}</p>}
                </div>
                <div className="col-span-2">
                    <Label>Access key secret</Label>
                    <Input type="text" value={form.data.access_key_secret} onChange={(e) => form.setData('access_key_secret', e.target.value)} />
                    {form.errors.access_key_secret && <p className="text-red-500">{form.errors.access_key_secret}</p>}
                </div>
                <div className="col-span-2">
                    <Label>Region</Label>
                    <Input type="text" value={form.data.region} onChange={(e) => form.setData('region', e.target.value)} />
                    <p className="mt-1 text-xs text-muted-foreground">default to "auto"</p>
                    {form.errors.region && <p className="text-red-500">{form.errors.region}</p>}
                </div>

                <div className="col-span-2">
                    <Label>Version</Label>
                    <Input type="text" value={form.data.version} onChange={(e) => form.setData('version', e.target.value)} />
                    <p className="mt-1 text-xs text-muted-foreground">default to "latest"</p>
                    {form.errors.version && <p className="text-red-500">{form.errors.version}</p>}
                </div>
            </div>
        </div>
    );
}
