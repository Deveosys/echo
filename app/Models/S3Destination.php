<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\MorphOne;

class S3Destination extends Destination
{
    protected $fillable = [
        'destination_id',
        'bucket_name',
        'access_key_id',
        'access_key_secret',
        'region',
        'endpoint',
        'version',
    ];

    public function destination(): MorphOne
    {
        return $this->morphOne(Destination::class, 'destination_type');
    }
}
