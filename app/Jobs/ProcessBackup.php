<?php

namespace App\Jobs;

use App\Models\BackupInstance;
use App\Services\DestinationService;
use App\Services\ZipService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessBackup implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private BackupInstance $backupInstance) {}

    /**
     * Execute the job.
     */
    public function handle(DestinationService $destinationService, ZipService $zipService): void
    {

        $this->backupInstance->update([
            'status' => 'processing',
            'started_at' => now(),
        ]);

        $backup = $this->backupInstance->backup;

        Log::info('Processing backup #'.$backup->name);
        $sourcePath = $backup->source_path;
        $isZip = false;
        if (is_dir($sourcePath)) {
            $zipPath = storage_path('sources/'.$backup->slug.'-'.now()->format('Y-m-d-H-i-s').'.zip');
            $zip = $zipService->createZipFile($zipPath);
            $zipService->addFilesToZip($sourcePath, $zip);
            $zipService->closeZipFile($zip);
            $sourcePath = $zipPath;
            $isZip = true;
            Log::info('Zip file created: '.$zipPath);
        }

        $s3Client = $destinationService->getDestinationClient($backup->destination);
        $bucketName = $backup->destination->destination_type->bucket_name;
        $keyName = $backup->slug.'/'.basename($sourcePath);

        try {
            $s3Client->putObject([
                'Bucket' => $bucketName,
                'Key' => $keyName,
                'Body' => fopen($sourcePath, 'r'),
                // 'ACL'    => 'public-read',
            ]);
            Log::info('S3 object uploaded: '.$keyName);

            $this->backupInstance->update([
                'status' => 'completed',
                'completed_at' => now(),
                'key_name' => $keyName,
            ]);

            if ($isZip) {
                unlink($sourcePath);
                Log::info('Temporary zip file deleted: '.$sourcePath);
            }
        } catch (\Exception $e) {

            $message = $e->getMessage();
            if ($e instanceof \Aws\S3\Exception\S3Exception) {
                $message = $e->getAwsErrorMessage();
            }
            Log::error('ERROR during S3 putObject: '.$message);
            $this->backupInstance->update([
                'status' => 'failed',
                'failed_at' => now(),
                'key_name' => $keyName,
                'error' => $message,
            ]);
            throw $e;
        }

        try {
            $backupInstances = BackupInstance::where('backup_id', '=', $backup->id)->where('status', '=', 'completed')->orderBy('completed_at', 'asc')->get();
            Log::info('Backup instances: '.$backupInstances->count());
            if ($backupInstances->count() > $backup->max_backup_instances) {
                Log::info('Max backup instances reached for backup '.$backup->id);
                Log::info($backupInstances->count() - $backup->max_backup_instances.' backup instances to delete');
                for ($i = 0; $i < $backupInstances->count() - $backup->max_backup_instances; $i++) {
                    $result = $s3Client->deleteObject([
                        'Bucket' => $bucketName,
                        'Key' => $backupInstances[$i]->key_name,
                    ]);

                    $deleted = ! $s3Client->doesObjectExistV2(
                        $bucketName,
                        $backupInstances[$i]->key_name
                    );

                    Log::info('Deleted: '.$deleted);

                    if ($deleted) {
                        Log::info('Backup instance '.$backupInstances[$i]->id.' deleted');
                        $backupInstances[$i]->delete();
                    } else {
                        Log::error('Error: '.$backupInstances[$i]->key_name.' was not deleted.'.PHP_EOL);
                    }
                }
            }
        } catch (\Aws\S3\Exception\S3Exception $e) {
            Log::error('S3 ERROR: '.$e->getAwsErrorMessage());
            throw $e;
        }
    }
}
