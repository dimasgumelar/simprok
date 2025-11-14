<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTransmission extends Model
{
    protected $table = 'user_transmissions';

    protected $fillable = ['user_id', 'transmission_id'];

    public function transmissionMaster()
    {
        return $this->belongsToMany(UserTransmission::class, 'user_transmissions');
    }
}