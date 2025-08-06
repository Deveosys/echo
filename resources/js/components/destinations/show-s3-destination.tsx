import { S3Destination } from '@/types/destinations';

export default function ShowS3Destination({ s3Destination }: { s3Destination: S3Destination }) {
    return (
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
    );
}
