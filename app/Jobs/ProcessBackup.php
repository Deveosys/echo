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
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return $this->backupInstance->id;
    }

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

        Log::info($this->backupInstance->id.'@'.$backup->name.' - Processing backup ');
        $sourcePath = $backup->source_path;
        $isZip = false;
        if (is_dir($sourcePath)) {
            $zipPath = storage_path('sources/'.$backup->slug.'-'.now()->format('Y-m-d-H-i-s').'.zip');
            $zip = $zipService->createZipFile($zipPath);
            $zipService->addFilesToZip($sourcePath, $zip);
            $zipService->closeZipFile($zip);
            $sourcePath = $zipPath;
            $isZip = true;
            Log::info($this->backupInstance->id.'@'.$backup->name.' - Zip file created: '.$zipPath);
        }

        $s3Client = $destinationService->getDestinationClient($backup->destination);
        $bucketName = $backup->destination->destination_type->bucket_name;
        $keyName = $backup->slug.'/'.basename($sourcePath);

        try {
            Log::info($this->backupInstance->id.'@'.$backup->name.' - Uploading to S3: '.$keyName);
            $s3Client->putObject([
                'Bucket' => $bucketName,
                'Key' => $keyName,
                'Body' => fopen($sourcePath, 'r'),
                // 'ACL'    => 'public-read',
            ]);
            Log::info($this->backupInstance->id.'@'.$backup->name.' - S3 object uploaded: '.$keyName);

            $this->backupInstance->update([
                'status' => 'completed',
                'completed_at' => now(),
                'key_name' => $keyName,
            ]);

            if ($isZip) {
                unlink($sourcePath);
                Log::info($this->backupInstance->id.'@'.$backup->name.' - Temporary zip file deleted: '.$sourcePath);
            }
        } catch (\Exception $e) {

            $message = $e->getMessage();
            if ($e instanceof \Aws\S3\Exception\S3Exception) {
                $message = $e->getAwsErrorMessage();
            }
            Log::error($this->backupInstance->id.'@'.$backup->name.' - ERROR during S3 putObject: '.$message);
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
            Log::info($this->backupInstance->id.'@'.$backup->name.' - Backup instances: '.$backupInstances->count());
            if ($backupInstances->count() > $backup->max_backup_instances) {
                Log::info($this->backupInstance->id.'@'.$backup->name.' - Max backup instances reached for backup '.$backup->id);
                Log::info($this->backupInstance->id.'@'.$backup->name.' - '.$backupInstances->count() - $backup->max_backup_instances.' backup instances to delete');
                for ($i = 0; $i < $backupInstances->count() - $backup->max_backup_instances; $i++) {
                    $result = $s3Client->deleteObject([
                        'Bucket' => $bucketName,
                        'Key' => $backupInstances[$i]->key_name,
                    ]);

                    $deleted = ! $s3Client->doesObjectExistV2(
                        $bucketName,
                        $backupInstances[$i]->key_name
                    );

                    if ($deleted) {
                        Log::info($this->backupInstance->id.'@'.$backup->name.' - Backup instance '.$backupInstances[$i]->id.' deleted');
                        $backupInstances[$i]->delete();
                    } else {
                        Log::error($this->backupInstance->id.'@'.$backup->name.' - Error: '.$backupInstances[$i]->key_name.' was not deleted.'.PHP_EOL);
                    }
                }
            }
        } catch (\Aws\S3\Exception\S3Exception $e) {
            Log::error($this->backupInstance->id.'@'.$backup->name.' - S3 ERROR: '.$e->getAwsErrorMessage());
            throw $e;
        }
    }
}
