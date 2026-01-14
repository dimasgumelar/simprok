<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GpsLog extends Model
{
    protected $fillable = [
        'device_id',
        'latitude',
        'longitude',
        'speed',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}