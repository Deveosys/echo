<?php

namespace App\Services;

use App\Models\Backup;
use Illuminate\Support\Facades\Log;

class BackupService
{
    public function __construct(private Backup $backup) {}

    // public function execute(DestinationService $destinationService, ZipService $zipService)
    // {
    //     Log::info('Processing backup ' . $this->backup->id);
    //     $sourcePath = $this->backup->source_path;
    //     if (is_dir($sourcePath)) {
    //         Log::info('IS DIR');
    //         $zipPath = storage_path('sources/' . $this->backup->slug . '/' . $this->backup->slug . '-' . now()->format('Y-m-d-H-i-s') . '.zip');
    //         $zip = $zipService->createZipFile($zipPath);
    //         $zipService->addFilesToZip($sourcePath, $zip);
    //         $zipService->closeZipFile($zip);
    //         $sourcePath = $zipPath;
    //     }

    //     $s3Client = $destinationService->getDestinationClient($this->backup->destination);
    //     Log::info('S3 CLIENT');

    //     try {
    //         $s3Client->putObject([
    //             'Bucket' => $this->backup->destination->destination_type->bucket_name,
    //             'Key'    => basename($sourcePath),
    //             'Body'   => fopen($sourcePath, 'r'),
    //             // 'ACL'    => 'public-read',
    //         ]);
    //     } catch (\Aws\S3\Exception\S3Exception $e) {
    //         Log::error('S3 ERROR: ' . $e->getAwsErrorMessage());
    //         throw $e;
    //     }
    // }
}
