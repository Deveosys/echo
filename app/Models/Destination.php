<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Destination extends Model
{
    protected $fillable = [
        'name',
    ];

    public function destination_type(): MorphTo
    {
        return $this->morphTo('destination_type');
    }
}
