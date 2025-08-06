<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBackupRequest;
use App\Http\Requests\UpdateBackupRequest;
use App\Jobs\ProcessBackup;
use App\Models\Backup;
use App\Models\BackupInstance;
use App\Models\Destination;
use App\Services\BackupService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

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
    public function create(BackupService $backupService)
    {
        return Inertia::render('backups/create', [
            'sourceTree' => $backupService->getSourceTreeLevel(storage_path('sources')),
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
            $slug = Str::slug($data['name']).($slugIndex > 0 ? '-'.$slugIndex : '');
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
    public function edit(Backup $backup, BackupService $backupService)
    {
        return Inertia::render('backups/edit', [
            'backup' => $backup->load('destination.destination_type'),
            'sourceTree' => $backupService->getSourceTreeLevel(storage_path('sources')),
            'destinations' => Destination::with('destination_type')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBackupRequest $request, Backup $backup)
    {
        $data = $request->validated();

        $backup->update($data);

        return redirect()->route('backups.show', $backup);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Backup $backup)
    {
        $backup->delete();

        return redirect()->route('backups.index');
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

    public function loadSourceTreeLevel(BackupService $backupService, Request $request)
    {
        $data = $request->validate(['dir' => 'required|string']);

        return $backupService->getSourceTreeLevel($data['dir']);
    }
}
