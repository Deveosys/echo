<?php

namespace App\Services;

use ZipArchive;

class ZipService
{
    private string $zipPath;

    public function createZipFile(string $zipPath)
    {
        $this->zipPath = $zipPath;
        $zip = new ZipArchive;

        if ($zip->open($this->zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \Exception('Cannot create zip file');
        }

        return $zip;
    }

    public function closeZipFile(ZipArchive $zip)
    {
        $zip->close();
    }

    public function addFilesToZip(string $folder, ZipArchive &$zip, string $parentFolder = '')
    {
        $handle = opendir($folder);
        if (! $handle) {
            throw new \Exception('The source directory is not valid.');
        }

        while (($file = readdir($handle)) !== false) {
            if ($file == '.' || $file == '..') {
                continue;
            }

            $filePath = $folder.DIRECTORY_SEPARATOR.$file;
            $localPath = $parentFolder.$file;

            if (is_dir($filePath)) {
                $zip->addEmptyDir($localPath);
                $this->addFilesToZip($filePath, $zip, $localPath.'/');
            } else {
                $zip->addFile($filePath, $localPath);
            }
        }

        closedir($handle);

        return true;
    }

    public function deleteZipFile()
    {
        if (isset($this->zipPath) && file_exists($this->zipPath)) {
            unlink($this->zipPath);
        }
    }
}
