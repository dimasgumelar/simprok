<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripStat extends Model
{
    protected $fillable = [
        'trip_id', 'device_id', 'km', 'avg_speed', 'min_speed', 'max_speed', 'p85_speed', 'count_logs'
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}