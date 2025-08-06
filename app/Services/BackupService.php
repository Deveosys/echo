<?php

namespace App\Services;

use App\Models\Backup;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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

    public function generateBackupSlug($name)
    {
        $slugIndex = 0;
        do {
            $slug = Str::slug($name).($slugIndex > 0 ? '-'.$slugIndex : '');
            $backup = Backup::where('slug', $slug)->first();
            $slugIndex++;
        } while ($backup);

        return $slug;
    }
}
