<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripStat extends Model
{
    protected $fillable = [
        'trip_id', 'km', 'avg_speed', 'min_speed', 'max_speed', 'p85_speed', 'count_logs'
    ];
}