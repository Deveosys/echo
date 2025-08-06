<?php

use App\Http\Controllers\BackupController;
use App\Http\Controllers\DestinationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('destinations', DestinationController::class);

    Route::resource('backups', BackupController::class);
    Route::get('backups/{backup}/execute', [BackupController::class, 'execute'])->name('backups.execute');
    Route::post('backups/load-source-tree-level', [BackupController::class, 'loadSourceTreeLevel'])->name('backups.loadSourceTreeLevel');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
