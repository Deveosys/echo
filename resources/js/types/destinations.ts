type DestinationBase = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    destination_type_type: 'App\\Models\\S3Destination' | 'App\\Models\\AzureDestination';
};

export type S3Destination = DestinationBase & {
    destination_type_type: 'App\\Models\\S3Destination';
    destination_type: {
        id: number;
        bucket_name: string;
        access_key_id: string;
        access_key_secret: string;
        region: string;
        endpoint: string;
        version: string;
    };
};

export type AzureDestination = DestinationBase & {
    destination_type_type: 'App\\Models\\AzureDestination';
    destination_type: {
        id: number;
        storage_account_name: string;
        storage_account_key: string;
        container_name: string;
    };
};

export type Destination = S3Destination | AzureDestination;

export type CreateDestinationFormData = {
    name: string;
    destination_type_type: 'App\\Models\\S3Destination' | 'App\\Models\\AzureDestination';
    bucket_name?: string;
    access_key_id?: string;
    access_key_secret?: string;
    region?: string;
    endpoint?: string;
    version?: string;
    storage_account_name?: string;
    storage_account_key?: string;
    container_name?: string;
};

export type S3Upload = {
    Initiated: string;
    Initiator: { ID: string; DisplayName: string };
    Key: string;
    Owner: { DisplayName: string; ID: string };
    StorageClass: string;
    UploadId: string;
};
