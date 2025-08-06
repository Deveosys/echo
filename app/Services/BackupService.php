<?php

namespace App\Services;

use App\Models\Backup;
use Illuminate\Support\Facades\Log;

class BackupService
{
    public function __construct(private Backup $backup) {}

    public function getSourceTreeLevel($dir)
    {
        try {
            $result = [];
            $cdir = scandir($dir);
            foreach ($cdir as $value) {
                if (! in_array($value, ['.', '..'])) {
                    $fullPath = $dir.DIRECTORY_SEPARATOR.$value;
                    $isDir = is_dir($fullPath);
                    $item = [
                        'name' => $value,
                        'dir' => $isDir,
                        'path' => $fullPath,
                        'children' => [],
                        'loaded' => $isDir ? false : true,
                    ];
                    $result[] = $item;
                }
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Error in dirToArray: '.$e->getMessage());
            throw $e;
        }
    }
}
