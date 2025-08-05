<?php

namespace App\Services;

use App\Models\Destination;
use App\Models\S3Destination;

class DestinationService
{
    public function getDestinationClient(Destination $destination)
    {

        switch ($destination->destination_type_type) {
            case 'App\Models\S3Destination':
                return $this->getS3Client($destination->destination_type);
            default:
                throw new \Exception('Destination type not supported');
        }
    }

    private function getS3Client(S3Destination $s3Destination)
    {
        $credentials = new \Aws\Credentials\Credentials($s3Destination->access_key_id, $s3Destination->access_key_secret);

        $options = [
            'region' => 'auto',
            'endpoint' => $s3Destination->endpoint,
            'version' => 'latest',
            'credentials' => $credentials,
        ];

        return new \Aws\S3\S3Client($options);
    }
}
