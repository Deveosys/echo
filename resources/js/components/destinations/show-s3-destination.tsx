import { S3Destination, S3Upload } from '@/types/destinations';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export default function ShowS3Destination({ s3Destination, s3_uploads }: { s3Destination: S3Destination; s3_uploads: S3Upload[] }) {
    return (
        <div>
            <div className="grid gap-2">
                <div>
                    <p className="font-semibold">Bucket name</p>
                    <p>{s3Destination.destination_type.bucket_name}</p>
                </div>
                <div>
                    <p className="font-semibold">Access key ID</p>
                    <p>{s3Destination.destination_type.access_key_id}</p>
                </div>
                <div>
                    <p className="font-semibold">Access key secret</p>
                    <p>{s3Destination.destination_type.access_key_secret}</p>
                </div>
                <div>
                    <p className="font-semibold">Region</p>
                    <p>{s3Destination.destination_type.region}</p>
                </div>
                <div>
                    <p className="font-semibold">Endpoint</p>
                    <p>{s3Destination.destination_type.endpoint}</p>
                </div>
                <div>
                    <p className="font-semibold">Version</p>
                    <p>{s3Destination.destination_type.version}</p>
                </div>
            </div>
            <div className="grid gap-4">
                <h3 className="mt-4 text-lg font-semibold">Uploads</h3>
                {s3_uploads.length === 0 && <div className="text-center text-sm text-muted-foreground">No pending uploads</div>}

                {s3_uploads.map((upload) => (
                    <S3UploadCard key={upload.UploadId} destination={s3Destination} upload={upload} />
                ))}
            </div>
        </div>
    );
}

function S3UploadCard({ destination, upload }: { destination: S3Destination; upload: S3Upload }) {
    const [isAborting, setIsAborting] = useState(false);

    const handleAbort = async () => {
        if (isAborting) return;
        setIsAborting(true);
        axios
            .post(route('destinations.abort-s3-upload', destination), {
                key: upload.Key,
                upload_id: upload.UploadId,
            })
            .then(() => {
                toast.success('Upload aborted successfully');
            })
            .catch(() => {
                toast.error('Failed to abort upload');
            })
            .finally(() => {
                setIsAborting(false);
            });
    };

    return (
        <Card key={upload.UploadId} className="overflow-hidden">
            <CardContent className="grid gap-2">
                <div>
                    <p className="font-semibold">Upload ID</p>
                    <p className="wrap-anywhere text-muted-foreground">{upload.UploadId}</p>
                </div>
                <div>
                    <p className="font-semibold">Key</p>
                    <p className="text-muted-foreground">{upload.Key}</p>
                </div>
                <div>
                    <p className="font-semibold">Initiated</p>
                    <p className="text-muted-foreground">{upload.Initiated}</p>
                </div>
                <div>
                    <p className="font-semibold">Initiator</p>
                    <p className="text-muted-foreground">{upload.Initiator.DisplayName}</p>
                </div>
                <div>
                    <p className="font-semibold">Owner</p>
                    <p className="text-muted-foreground">{upload.Owner.DisplayName}</p>
                </div>
                <div>
                    <p className="font-semibold">Storage Class</p>
                    <p className="text-muted-foreground">{upload.StorageClass}</p>
                </div>
                <div className="flex justify-end">
                    <Button disabled={isAborting} onClick={() => handleAbort()}>
                        {isAborting ? 'Aborting...' : 'Abort'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
