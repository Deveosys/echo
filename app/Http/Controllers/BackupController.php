<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBackupRequest;
use App\Http\Requests\UpdateBackupRequest;
use App\Jobs\ProcessBackup;
use App\Models\Backup;
use App\Models\BackupInstance;
use App\Models\Destination;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

function dirToArray($dir)
{
    try {
        $result = [];
        $cdir = scandir($dir);
        foreach ($cdir as $value) {
            if (! in_array($value, ['.', '..'])) {
                $fullPath = $dir . DIRECTORY_SEPARATOR . $value;
                $isDir = is_dir($fullPath);
                $item = [
                    'name' => $value,
                    'dir' => $isDir,
                    'path' => $fullPath,
                    'children' => $isDir ? dirToArray($fullPath) : [],
                ];
                $result[] = $item;
            }
        }

        return $result;
    } catch (\Exception $e) {
        Log::error("Error in dirToArray: " . $e->getMessage());
        return [];
    }
}

class BackupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('backups/index', [
            'backups' => Backup::with('destination.destination_type')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('backups/create', [
            // 'sourceTree' => dirToArray(storage_path('sources')),
            'sourceTree' => [],
            'destinations' => Destination::with('destination_type')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBackupRequest $request)
    {
        $data = $request->validated();

        $slugIndex = 0;
        do {
            $slug = Str::slug($data['name']) . ($slugIndex > 0 ? '-' . $slugIndex : '');
            $backup = Backup::where('slug', $slug)->first();
            $slugIndex++;
        } while ($backup);

        $backup = Backup::create(
            [
                'name' => $data['name'],
                'slug' => $slug,
                'destination_id' => $data['destination_id'],
                'source_path' => $data['source_path'],
                'frequency' => $data['frequency'],
            ]
        );

        return redirect()->route('backups.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Backup $backup)
    {
        return Inertia::render('backups/show', [
            'backup' => $backup->load('destination.destination_type', 'backupInstances'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Backup $backup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBackupRequest $request, Backup $backup)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Backup $backup)
    {
        //
    }

    public function execute(Backup $backup)
    {
        $backupInstance = BackupInstance::create([
            'backup_id' => $backup->id,
            'status' => 'pending',
            'started_at' => now(),
        ]);

        ProcessBackup::dispatch($backupInstance);

        return redirect()->route('backups.show', $backup);
    }
}
