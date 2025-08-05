<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Backup extends Model
{
    protected $fillable = [
        'destination_id',
        'name',
        'slug',
        'source_path',
        'frequency',
    ];

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function backupInstances(): HasMany
    {
        return $this->hasMany(BackupInstance::class)->orderBy('created_at', 'desc');
    }
}
